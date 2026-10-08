'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ImagePlus, Loader2, Star, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import { THEMES } from '../theme'
import { useSiteTheme } from '../useSiteTheme'
import { ListingPhoto } from '../ListingPhoto'
import { supabase } from '@/lib/supabase'
import { MAX_PHOTOS, PHOTO_BUCKET, PRICE_CAP, PROPERTY_TYPES, formatPrice, sortPhotos } from '@/lib/listing'
import {
  DESCRIPTION_MAX, EMPTY_LISTING, LISTING_STATUSES, US_STATES, parsePrice, priceCapMessage, toPropertyRow, validateListing,
  type ListingErrors, type ListingFormValues, type ListingStatus,
} from '@/lib/listing-form'
import { preparePhoto } from '@/lib/photo-prep'

type Photo =
  | { kind: 'saved'; key: string; id: string; storage_path: string; position: number }
  | { kind: 'new'; key: string; blob: Blob; preview: string }

const newKey = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

function Field({ id, label, error, hint, children, className = '' }: { id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-medium text-red-700">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-600">{hint}</p>
      ) : null}
    </div>
  )
}

export default function ListingForm({ user, propertyId }: { user: User; propertyId?: string }) {
  const t = THEMES[useSiteTheme()]
  const router = useRouter()
  const editing = !!propertyId
  const [values, setValues] = useState<ListingFormValues>(EMPTY_LISTING)
  const [errors, setErrors] = useState<ListingErrors>({})
  const [photos, setPhotos] = useState<Photo[]>([])
  const [removed, setRemoved] = useState<{ id: string; storage_path: string }[]>([])
  const [loading, setLoading] = useState(editing)
  const [notFound, setNotFound] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [preparing, setPreparing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const previews = useRef<string[]>([])

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), [])

  useEffect(() => {
    if (!propertyId) return
    let alive = true
    supabase
      .from('properties')
      .select('*, property_sale_info(list_price, is_test), property_photos(id, storage_path, position)')
      .eq('id', propertyId)
      .eq('landlord_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return
        if (error || !data) {
          if (error) console.error('[listing] load failed', error.code)
          setNotFound(true)
          setLoading(false)
          return
        }
        const sale = (Array.isArray(data.property_sale_info) ? data.property_sale_info[0] : data.property_sale_info) as { list_price: number; is_test: boolean } | null
        setReadOnly(!!sale?.is_test)
        setValues({
          address: data.address ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          zip: data.zip_code ?? '',
          price: sale?.list_price ? String(sale.list_price) : '',
          beds: data.bedrooms == null ? '' : String(data.bedrooms),
          baths: data.bathrooms == null ? '' : String(Number(data.bathrooms)),
          sqft: data.square_feet == null ? '' : String(data.square_feet),
          type: PROPERTY_TYPES.some((p) => p.value === data.property_type) ? data.property_type : 'house',
          description: data.description ?? '',
          status: (LISTING_STATUSES.some((s) => s.value === data.status) ? data.status : 'inactive') as ListingStatus,
        })
        setPhotos(sortPhotos(data.property_photos as { id: string; storage_path: string; position: number }[]).map((p) => ({ kind: 'saved', key: p.id, ...p })))
        setLoading(false)
      })
    return () => { alive = false }
  }, [propertyId, user.id])

  const set = (k: keyof ListingFormValues) => (e: { target: { value: string } }) => {
    const v = e.target.value
    setValues((cur) => ({ ...cur, [k]: v }))
    if (errors[k]) setErrors((cur) => ({ ...cur, [k]: undefined }))
  }

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) { toast.error(`Up to ${MAX_PHOTOS} photos per home.`); return }
    const list = Array.from(files).slice(0, room)
    if (files.length > room) toast(`Only the first ${room} photo${room === 1 ? '' : 's'} were added (max ${MAX_PHOTOS}).`)
    setPreparing(true)
    const added: Photo[] = []
    for (const f of list) {
      try {
        const blob = await preparePhoto(f)
        const preview = URL.createObjectURL(blob)
        previews.current.push(preview)
        added.push({ kind: 'new', key: newKey(), blob, preview })
      } catch (err) {
        toast.error((err as Error).message)
      }
    }
    setPhotos((cur) => [...cur, ...added])
    setPreparing(false)
    if (fileInput.current) fileInput.current.value = ''
  }

  const removePhoto = (key: string) => {
    const p = photos.find((x) => x.key === key)
    if (p?.kind === 'saved') setRemoved((r) => [...r, { id: p.id, storage_path: p.storage_path }])
    setPhotos((cur) => cur.filter((x) => x.key !== key))
  }
  const makeCover = (key: string) => setPhotos((cur) => [...cur.filter((x) => x.key === key), ...cur.filter((x) => x.key !== key)])

  const syncPhotos = async (id: string) => {
    let failed = 0
    if (removed.length) {
      const { error: rmErr } = await supabase.storage.from(PHOTO_BUCKET).remove(removed.map((r) => r.storage_path))
      if (rmErr) console.warn('[listing] storage remove failed', rmErr.message)
      const { error } = await supabase.from('property_photos').delete().in('id', removed.map((r) => r.id))
      if (error) failed++
      else setRemoved([])
    }
    const next: Photo[] = []
    for (const [i, p] of photos.entries()) {
      if (p.kind === 'saved') {
        if (p.position !== i) {
          const { error } = await supabase.from('property_photos').update({ position: i }).eq('id', p.id)
          if (error) failed++
        }
        next.push({ ...p, position: i })
        continue
      }
      setSaving(`Uploading photo ${i + 1} of ${photos.length}…`)
      const path = `${user.id}/${id}/${newKey()}.jpg`
      const { error: upErr } = await supabase.storage.from(PHOTO_BUCKET).upload(path, p.blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false })
      if (upErr) { console.error('[listing] upload failed', upErr.message); failed++; next.push(p); continue }
      const { data: row, error } = await supabase.from('property_photos').insert({ property_id: id, storage_path: path, position: i }).select('id').single()
      if (error || !row) {
        failed++
        await supabase.storage.from(PHOTO_BUCKET).remove([path])
        next.push(p)
        continue
      }
      next.push({ kind: 'saved', key: row.id, id: row.id, storage_path: path, position: i })
    }
    setPhotos(next)
    return failed
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly || saving) return
    const errs = validateListing(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      toast.error('Please fix the highlighted fields.')
      return
    }
    const price = parsePrice(values.price)
    const row = toPropertyRow(values)
    let id = propertyId
    try {
      setSaving('Saving listing…')
      if (!id) {
        // Created hidden first; it goes live only once the price and photos are saved.
        const { data, error } = await supabase
          .from('properties')
          .insert({ ...row, landlord_id: user.id, status: 'inactive', monthly_rent: null, security_deposit: null })
          .select('id')
          .single()
        if (error || !data) throw error ?? new Error('insert failed')
        id = data.id as string
        const { error: saleErr } = await supabase.from('property_sale_info').insert({ property_id: id, list_price: price, is_test: false })
        if (saleErr) throw saleErr
      } else {
        const { error } = await supabase.from('properties').update(row).eq('id', id)
        if (error) throw error
        const { error: saleErr } = await supabase
          .from('property_sale_info')
          .upsert({ property_id: id, list_price: price, is_test: false }, { onConflict: 'property_id' })
        if (saleErr) throw saleErr
      }
      const photoFailures = await syncPhotos(id!)
      setSaving('Publishing…')
      const { error: stErr } = await supabase.from('properties').update({ status: values.status }).eq('id', id!)
      if (stErr) throw stErr
      if (photoFailures) toast.error(`Saved, but ${photoFailures} photo change${photoFailures === 1 ? '' : 's'} failed. Try saving again.`)
      else toast.success(values.status === 'active' ? 'Listing is live!' : 'Listing saved.')
      if (!editing || !photoFailures) router.push(photoFailures ? `/agent/listings/${id}/edit` : '/agent/listings')
    } catch (err) {
      console.error('[listing] save failed', err)
      toast.error("Couldn't save the listing. Check your connection and try again.")
      if (!editing && id) router.replace(`/agent/listings/${id}/edit`)
    } finally {
      setSaving(null)
    }
  }

  const onDelete = async () => {
    if (!propertyId || saving) return
    if (!window.confirm('Delete this listing and its photos? This cannot be undone.')) return
    setSaving('Deleting…')
    const paths = [...photos.filter((p) => p.kind === 'saved').map((p) => (p as { storage_path: string }).storage_path), ...removed.map((r) => r.storage_path)]
    if (paths.length) {
      const { error } = await supabase.storage.from(PHOTO_BUCKET).remove(paths)
      if (error) console.warn('[listing] storage remove failed', error.message)
    }
    const { error } = await supabase.from('properties').delete().eq('id', propertyId)
    setSaving(null)
    if (error) { toast.error("Couldn't delete the listing. Try again."); return }
    toast.success('Listing deleted.')
    router.push('/agent/listings')
  }

  if (loading)
    return (
      <div className="flex justify-center py-24" role="status" aria-label="Loading">
        <Loader2 className={`w-10 h-10 animate-spin ${t.accentText}`} aria-hidden="true" />
      </div>
    )
  if (notFound)
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
        <p className="text-gray-700 mb-6">It may have been deleted, or it belongs to another account.</p>
        <Link href="/agent/listings" className={`inline-block ${t.gradient} text-white px-6 py-3 rounded-lg font-semibold`}>Back to my listings</Link>
      </div>
    )

  const input = (k: keyof ListingFormValues) =>
    `w-full rounded-lg border ${errors[k] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100`
  const aria = (k: keyof ListingFormValues, hint = false) => ({
    id: `f-${k}`,
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': errors[k] ? `f-${k}-error` : hint ? `f-${k}-hint` : undefined,
    disabled: readOnly || !!saving,
  })
  const priceNum = parsePrice(values.price)
  const priceHint = !Number.isNaN(priceNum) && priceNum > 0
    ? priceNum > PRICE_CAP
      ? <span className="font-semibold text-red-700">{priceCapMessage}</span>
      : `${formatPrice(priceNum)}. Max ${formatPrice(PRICE_CAP)}.`
    : `Whole dollars. Max ${formatPrice(PRICE_CAP)}: Meatloaf only lists homes at or under $300K.`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link href="/agent/listings" className={`inline-flex items-center gap-1 text-sm font-semibold ${t.labelText} hover:underline mb-4`}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> My listings
      </Link>
      <h1 className={`text-3xl md:text-4xl font-black ${t.gradientText} mb-2`}>{editing ? 'Edit listing' : 'List a home for sale'}</h1>
      <p className="text-gray-700 mb-6">Starter homes only: every {t.name} listing is {formatPrice(PRICE_CAP)} or less. Buyers who ask about it contact you directly.</p>

      {readOnly && (
        <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="note">
          This is a TEST listing used for development. It&apos;s read-only and never shown publicly.
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <section className="rounded-2xl bg-white shadow-lg p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Address</h2>
          <Field id="f-address" label="Street address" error={errors.address}>
            <input {...aria('address')} className={input('address')} value={values.address} onChange={set('address')} autoComplete="street-address" placeholder="123 Main St" maxLength={200} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-4">
            <Field id="f-city" label="City" error={errors.city}>
              <input {...aria('city')} className={input('city')} value={values.city} onChange={set('city')} autoComplete="address-level2" maxLength={100} />
            </Field>
            <Field id="f-state" label="State" error={errors.state}>
              <select {...aria('state')} className={input('state')} value={values.state} onChange={set('state')}>
                <option value="">Choose</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field id="f-zip" label="ZIP code" error={errors.zip}>
              <input {...aria('zip')} className={input('zip')} value={values.zip} onChange={set('zip')} inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="21201" />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-white shadow-lg p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Price and details</h2>
          <Field id="f-price" label="List price (USD)" error={errors.price} hint={priceHint}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true">$</span>
              <input {...aria('price', true)} className={`${input('price')} pl-7`} value={values.price} onChange={set('price')} inputMode="numeric" placeholder="249900" />
            </div>
          </Field>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field id="f-beds" label="Bedrooms" error={errors.beds}>
              <input {...aria('beds')} className={input('beds')} value={values.beds} onChange={set('beds')} type="number" min={0} max={20} step={1} inputMode="numeric" />
            </Field>
            <Field id="f-baths" label="Bathrooms" error={errors.baths}>
              <input {...aria('baths')} className={input('baths')} value={values.baths} onChange={set('baths')} type="number" min={0} max={20} step={0.5} inputMode="decimal" />
            </Field>
            <Field id="f-sqft" label="Square feet" error={errors.sqft} hint="Optional">
              <input {...aria('sqft', true)} className={input('sqft')} value={values.sqft} onChange={set('sqft')} inputMode="numeric" placeholder="1200" />
            </Field>
            <Field id="f-type" label="Home type" error={errors.type}>
              <select {...aria('type')} className={input('type')} value={values.type} onChange={set('type')}>
                {PROPERTY_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
          </div>
          <Field
            id="f-description"
            label="Description"
            error={errors.description}
            hint={`Describe the home itself: rooms, updates, features. Fair housing law applies, so don't describe who should live there or the people nearby. ${values.description.length}/${DESCRIPTION_MAX.toLocaleString('en-US')}`}
          >
            <textarea {...aria('description', true)} className={`${input('description')} min-h-36`} value={values.description} onChange={set('description')} maxLength={DESCRIPTION_MAX + 200} rows={6} />
          </Field>
        </section>

        <section className="rounded-2xl bg-white shadow-lg p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h2 className="text-lg font-bold text-gray-900">Photos</h2>
            <span className="text-sm text-gray-600">{photos.length}/{MAX_PHOTOS}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">JPG, PNG or WebP. Large photos are resized automatically. The first photo is the cover.</p>
          {photos.length > 0 && (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {photos.map((p, i) => (
                <li key={p.key} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] group">
                  {p.kind === 'saved' ? (
                    <ListingPhoto path={p.storage_path} alt={`Photo ${i + 1}`} className="w-full h-full" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.preview} alt={`New photo ${i + 1}`} className="w-full h-full object-cover" />
                  )}
                  {i === 0 && <span className={`absolute top-2 left-2 ${t.gradient} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>Cover</span>}
                  {p.kind === 'new' && <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Not saved yet</span>}
                  {!readOnly && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      {i > 0 && (
                        <button type="button" onClick={() => makeCover(p.key)} disabled={!!saving} aria-label={`Make photo ${i + 1} the cover`} className="rounded-full bg-white/90 p-1.5 text-gray-900 shadow hover:bg-white">
                          <Star className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                      <button type="button" onClick={() => removePhoto(p.key)} disabled={!!saving} aria-label={`Remove photo ${i + 1}`} className="rounded-full bg-white/90 p-1.5 text-red-700 shadow hover:bg-white">
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!readOnly && photos.length < MAX_PHOTOS && (
            <label className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed ${t.accentBorder} ${t.softBg} px-4 py-6 cursor-pointer font-semibold ${t.labelText} hover:opacity-90`}>
              {preparing ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="w-5 h-5" aria-hidden="true" />}
              {preparing ? 'Preparing photos…' : 'Add photos'}
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} disabled={preparing || !!saving} data-testid="photo-input" />
            </label>
          )}
        </section>

        <section className="rounded-2xl bg-white shadow-lg p-5 sm:p-6 space-y-4">
          <Field id="f-status" label="Listing status" hint={`Only Active listings appear on ${t.name}.`}>
            <select {...aria('status', true)} className={input('status')} value={values.status} onChange={set('status')}>
              {LISTING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <p className="text-xs text-gray-600">
            By publishing, you confirm you&apos;re authorized to advertise this home, the details are accurate, and the listing complies with fair housing law.
            The $29 founding-rate listing fee isn&apos;t charged online yet.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            {editing && !readOnly ? (
              <button type="button" onClick={onDelete} disabled={!!saving} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
                <Trash2 className="w-4 h-4" aria-hidden="true" /> Delete listing
              </button>
            ) : <span />}
            <button type="submit" disabled={readOnly || !!saving || preparing} className={`inline-flex items-center justify-center gap-2 ${t.gradient} text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-60`}>
              {saving && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
              {saving ?? (editing ? 'Save changes' : values.status === 'active' ? 'Publish listing' : 'Save listing')}
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
