import { useState } from 'react'
import { Code, CheckCircle, AlertTriangle, FileText, Copy, Download, Plus, Trash2 } from 'lucide-react'

const API_BASE = '/api'

const schemaTypes = [
  { id: 'Article', name: 'Article', icon: '📰' },
  { id: 'Product', name: 'Product', icon: '🛒' },
  { id: 'FAQPage', name: 'FAQ', icon: '❓' },
  { id: 'HowTo', name: 'How-To', icon: '📋' },
  { id: 'LocalBusiness', name: 'Local Business', icon: '📍' },
  { id: 'Event', name: 'Event', icon: '📅' },
  { id: 'Organization', name: 'Organization', icon: '🏢' }
]

function App() {
  const [activeTab, setActiveTab] = useState('generator')
  const [selectedType, setSelectedType] = useState('Article')
  const [schemaData, setSchemaData] = useState({})
  const [generatedSchema, setGeneratedSchema] = useState(null)
  const [validation, setValidation] = useState(null)

  const generateSchema = async () => {
    try {
      const res = await fetch(`${API_BASE}/schema/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, data: schemaData })
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedSchema(data.schema)
        validateSchema(data.schema)
      }
    } catch (err) {
      console.error('Failed to generate schema:', err)
    }
  }

  const validateSchema = async (schema) => {
    try {
      const res = await fetch(`${API_BASE}/validate/schema`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema })
      })
      const data = await res.json()
      setValidation(data)
    } catch (err) {
      console.error('Failed to validate schema:', err)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Schema Generator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Schema Type Selector */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Schema Markup Generator</h1>
          <div className="flex gap-2 flex-wrap">
            {schemaTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  selectedType === type.id 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              {selectedType} Schema
            </h2>
            <SchemaForm type={selectedType} data={schemaData} onChange={setSchemaData} />
            <button
              onClick={generateSchema}
              className="mt-4 w-full px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              Generate Schema
            </button>
          </div>

          {/* Output */}
          <div className="space-y-6">
            {/* Validation */}
            {validation && (
              <div className={`rounded-xl p-4 ${validation.valid ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {validation.valid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-semibold ${validation.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {validation.valid ? 'Valid Schema' : 'Validation Errors'}
                  </span>
                </div>
                
                {validation.errors?.length > 0 && (
                  <div className="space-y-2">
                    {validation.errors.map((err, i) => (
                      <div key={i} className="text-sm text-red-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></span>
                        {err.path && <span className="text-red-400">{err.path}: </span>}
                        {err.message}
                      </div>
                    ))}
                  </div>
                )}
                
                {validation.warnings?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-500/20">
                    <p className="text-sm text-yellow-400 mb-2">Warnings:</p>
                    {validation.warnings.map((w, i) => (
                      <div key={i} className="text-sm text-yellow-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5"></span>
                        {w.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generated Schema */}
            {generatedSchema && (
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold">Generated JSON-LD</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedSchema)}
                      className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-sm text-teal-300 overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(generatedSchema, null, 2)}
                </pre>
              </div>
            )}

            {/* Rich Preview */}
            {generatedSchema && validation?.valid && (
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="font-semibold text-slate-900">Rich Result Preview</h3>
                </div>
                <div className="p-4">
                  <RichPreview schema={generatedSchema} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SchemaForm({ type, data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value })

  switch (type) {
    case 'Article':
      return (
        <div className="space-y-4">
          <FormField label="Headline" value={data.headline} onChange={v => update('headline', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <FormField label="Author" value={data.author} onChange={v => update('author', v)} />
          <FormField label="Date Published" value={data.datePublished} onChange={v => update('datePublished', v)} type="date" />
          <FormField label="Image URL" value={data.image} onChange={v => update('image', v)} />
          <FormField label="URL" value={data.url} onChange={v => update('url', v)} />
        </div>
      )

    case 'Product':
      return (
        <div className="space-y-4">
          <FormField label="Product Name" value={data.name} onChange={v => update('name', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <FormField label="SKU" value={data.sku} onChange={v => update('sku', v)} />
          <FormField label="Brand" value={data.brand} onChange={v => update('brand', v)} />
          <FormField label="Price" value={data.price} onChange={v => update('price', v)} />
          <FormField label="Currency" value={data.priceCurrency || 'USD'} onChange={v => update('priceCurrency', v)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.inStock} onChange={e => update('inStock', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">In Stock</span>
          </label>
        </div>
      )

    case 'FAQPage':
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-400 mb-2">Add questions and answers:</p>
          {(data.questions || []).map((q, i) => (
            <div key={i} className="bg-slate-900 rounded-lg p-3 space-y-2">
              <input
                type="text"
                value={q.question || ''}
                onChange={e => {
                  const qs = [...(data.questions || [])]
                  qs[i] = { ...qs[i], question: e.target.value }
                  update('questions', qs)
                }}
                placeholder="Question"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
              <textarea
                value={q.answer || ''}
                onChange={e => {
                  const qs = [...(data.questions || [])]
                  qs[i] = { ...qs[i], answer: e.target.value }
                  update('questions', qs)
                }}
                placeholder="Answer"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20"
              />
            </div>
          ))}
          <button
            onClick={() => update('questions', [...(data.questions || []), { question: '', answer: '' }])}
            className="w-full px-4 py-2 border border-dashed border-slate-600 rounded-lg hover:border-slate-500 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      )

    case 'HowTo':
      return (
        <div className="space-y-4">
          <FormField label="How-To Name" value={data.name} onChange={v => update('name', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <p className="text-sm text-slate-400 mt-4">Steps:</p>
          {(data.steps || []).map((step, i) => (
            <div key={i} className="bg-slate-900 rounded-lg p-3">
              <input
                type="text"
                value={step.name || ''}
                onChange={e => {
                  const steps = [...(data.steps || [])]
                  steps[i] = { ...steps[i], name: e.target.value }
                  update('steps', steps)
                }}
                placeholder={`Step ${i + 1}`}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-2"
              />
              <textarea
                value={step.text || ''}
                onChange={e => {
                  const steps = [...(data.steps || [])]
                  steps[i] = { ...steps[i], text: e.target.value }
                  update('steps', steps)
                }}
                placeholder="Step description"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-16"
              />
            </div>
          ))}
          <button
            onClick={() => update('steps', [...(data.steps || []), { name: '', text: '' }])}
            className="w-full px-4 py-2 border border-dashed border-slate-600 rounded-lg hover:border-slate-500 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      )

    case 'LocalBusiness':
      return (
        <div className="space-y-4">
          <FormField label="Business Name" value={data.name} onChange={v => update('name', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <FormField label="Street Address" value={data.street} onChange={v => update('street', v)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" value={data.city} onChange={v => update('city', v)} />
            <FormField label="State" value={data.state} onChange={v => update('state', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Zip Code" value={data.zip} onChange={v => update('zip', v)} />
            <FormField label="Phone" value={data.phone} onChange={v => update('phone', v)} />
          </div>
          <FormField label="Website URL" value={data.url} onChange={v => update('url', v)} />
        </div>
      )

    case 'Event':
      return (
        <div className="space-y-4">
          <FormField label="Event Name" value={data.name} onChange={v => update('name', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <FormField label="Start Date" value={data.startDate} onChange={v => update('startDate', v)} type="datetime-local" />
          <FormField label="End Date" value={data.endDate} onChange={v => update('endDate', v)} type="datetime-local" />
          <FormField label="Venue" value={data.venue} onChange={v => update('venue', v)} />
          <FormField label="Organizer" value={data.organizer} onChange={v => update('organizer', v)} />
          <FormField label="Price" value={data.price} onChange={v => update('price', v)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.virtual} onChange={e => update('virtual', e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">Virtual Event</span>
          </label>
        </div>
      )

    case 'Organization':
      return (
        <div className="space-y-4">
          <FormField label="Organization Name" value={data.name} onChange={v => update('name', v)} />
          <FormField label="Description" value={data.description} onChange={v => update('description', v)} />
          <FormField label="Website URL" value={data.url} onChange={v => update('url', v)} />
          <FormField label="Logo URL" value={data.logo} onChange={v => update('logo', v)} />
          <FormField label="Email" value={data.email} onChange={v => update('email', v)} />
          <FormField label="Founded Date" value={data.foundingDate} onChange={v => update('foundingDate', v)} type="date" />
        </div>
      )

    default:
      return <p className="text-slate-400">Form not available for this type</p>
  }
}

function FormField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  )
}

function RichPreview({ schema }) {
  const type = schema['@type']
  
  switch (type) {
    case 'Article':
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4">
            <p className="text-sm text-blue-600 mb-1">{schema.datePublished}</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{schema.headline}</h2>
            <p className="text-slate-600 text-sm mb-2">{schema.description}</p>
            {schema.author && (
              <p className="text-xs text-slate-500">By {schema.author.name || schema.author}</p>
            )}
          </div>
        </div>
      )

    case 'Product':
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4">
            <p className="text-sm text-slate-500 mb-1">{schema.brand?.name || 'Brand'}</p>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{schema.name}</h2>
            <p className="text-slate-600 text-sm mb-2">{schema.description}</p>
            <p className="text-lg font-bold text-slate-900">
              {schema.offers?.priceCurrency || 'USD'} {schema.offers?.price || '0'}
            </p>
          </div>
        </div>
      )

    case 'FAQPage':
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
            {schema.mainEntity?.map((q, i) => (
              <div key={i} className="mb-3">
                <p className="font-medium text-slate-900">{q.name}</p>
                <p className="text-slate-600 text-sm">{q.acceptedAnswer?.text}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'LocalBusiness':
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="font-bold text-slate-900 mb-2">{schema.name}</h2>
            <p className="text-slate-600 text-sm mb-2">{schema.description}</p>
            <p className="text-sm text-slate-500">
              {schema.address?.streetAddress}, {schema.address?.addressLocality}, {schema.address?.addressRegion} {schema.address?.postalCode}
            </p>
            {schema.telephone && <p className="text-sm text-slate-500 mt-1">{schema.telephone}</p>}
          </div>
        </div>
      )

    default:
      return (
        <div className="border border-slate-200 rounded-lg p-4">
          <p className="text-slate-600 text-sm">Preview not available for {type}</p>
        </div>
      )
  }
}

export default App
