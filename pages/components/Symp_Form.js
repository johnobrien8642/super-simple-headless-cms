import { useState, useEffect, useRef } from 'react'

const SympForm = () => {
  let [string, setString] = useState('')
  let [sympathyAmount, setSympathyAmount] = useState(0)
  let [byAlpha, setByAlpha] = useState(false)
  let [byAmount, setByAmount] = useState(true)
  let [data, setData] = useState([])
  let [emotions, setEmotions] = useState(true)
  let [financialOrMaterial, setFinancialOrMaterial] = useState(false)
  let [identity, setIdentity] = useState(false)
  let [physical, setPhysical] = useState(false)
  let [success, setSuccess] = useState(false)
  let [error, setError] = useState('')
  let inputRef = useRef(null)
  
  useEffect(() => {
    if (success) {
      inputRef.current.focus()
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
      reset()
    }
  })
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/get_items`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: handleCategory()
        })
      })
      const data = await res.json()
      setData(data.sympItems)
    }
    fetchData()
  }, [emotions, financialOrMaterial, identity, physical, success])
  
  function reset() {
    setString('')
    setSympathyAmount('')
    setError('')
  }

  function compareFn (a, b) {
    if (byAlpha) {
      if (a.item < b.item) return -1
      if (a.item > b.item) return 1
      return 0
    } 
    if (byAmount) {
      return a.sympathyAmount - b.sympathyAmount
    }
  }

  function handleCategory() {
    if (emotions) {
      return 'emotions'
    } else if (financialOrMaterial) {
      return 'financial-or-material'
    } else if (identity) {
      return 'identity'
    } else if (physical) {
      return 'physical'
    }
  }
  
  return (
    <div
      className='form container'
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch(`/api/sympathy_item_create`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              string: string,
              sympathyAmount: sympathyAmount,
              category: handleCategory()
            })
          })

          if (res.ok) {
            reset()
            setSuccess(true)
          } else {
            const data = await res.json()
            console.log('Error in Form:', data.errorMessage)
            setError(data.errorMessage)
          }
        }}
      >
        <div
          className='string'
        >
          <span>Sympathy String</span>
          <input
            ref={inputRef}
            value={string}
            onInput={e => {
              setString(e.target.value)
            }}
          />
        </div>
        <div
          className='sympathy-amount'
        >
          <span>Sympathy Amount</span>
          <input
            type='number'
            value={sympathyAmount}
            onInput={e => {
              setSympathyAmount(e.target.value)
            }}
          />
        </div>
        <div
          className='sympathy-category'
        >
          <span>Sympathy Category</span>
          <div>
            <label htmlFor='emotions'>
              Emotions
              <input
                type='radio' 
                name='emotions' 
                onClick={() => {
                  setEmotions(true)
                }}
                onChange={() => {
                  setPhysical(false)
                  setIdentity(false)
                  setFinancialOrMaterial(false)
                }}
                checked={emotions}
              ></input>
            </label>
            <label
              htmlFor='financial-or-material'
            >
              Financial or Material
              <input 
                type='radio' 
                name='financial-or-material'
                onClick={() => {
                  setFinancialOrMaterial(true)
                }}
                onChange={() => {
                  setPhysical(false)
                  setIdentity(false)
                  setEmotions(false)
                }}
                checked={financialOrMaterial}
              ></input>
            </label>
            <label
              htmlFor='identity'
            >
              Identity
              <input 
                type='radio' 
                name='identity'
                onClick={() => {
                  setIdentity(true)
                }}
                onChange={() => {
                  setPhysical(false)
                  setFinancialOrMaterial(false)
                  setEmotions(false)
                }}
                checked={identity}
              ></input>
            </label>
            <label
              htmlFor='physical'
            >
              Physical
              <input
                type='radio' 
                name='physical'
                onClick={() => {
                  setPhysical(true)
                }}
                onChange={() => {
                  setIdentity(false)
                  setFinancialOrMaterial(false)
                  setEmotions(false)
                }}
                checked={physical}
              ></input>
            </label>
          </div>
        </div>
        <button
          className='create-btn'
        >
          Create
        </button>
        <span
          className={`success${success ? ' active' : ''}`}
        >
          Success
        </span>
        <span
          className={`error${error ? ' active' : ''}`}
        >
          {error}
        </span>
      </form>

      <div
        className='symp-item-list-container'
      >
        <div
          className='filter'
        >
          <h3>Sort</h3>
          <div
            className='btn-container'
          >
            <button
              onClick={e => {
                e.preventDefault()                
                setByAlpha(true)
                setByAmount(false)
              }}
            >
              Alphabetically
            </button>
            <button
              onClick={e => {
                e.preventDefault()
                setByAlpha(false)
                setByAmount(true)
              }}
            >
              Sympathy Amount
            </button>
          </div>
        </div>
        <ul
          className='symp-item-list'
        >
          {data?.sort(compareFn).map(post => {
            return (
              <li
                className='list-item'
                key={post._id}
              >
                <span>{post.item}</span>
                <span> | </span>
                <span>{post.sympathyAmount}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SympForm