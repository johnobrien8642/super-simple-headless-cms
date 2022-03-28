import { useState, useEffect, useRef } from 'react'

const SympForm = () => {
  let [string, setString] = useState('')
  let [sympathyAmount, setSympathyAmount] = useState(0)
  let [byAlpha, setByAlpha] = useState(false)
  let [byAmount, setByAmount] = useState(true)
  let [data, setData] = useState([])
  let [postId, setPostId] = useState(null)
  let [emotions, setEmotions] = useState(true)
  let [financialOrMaterial, setFinancialOrMaterial] = useState(false)
  let [identity, setIdentity] = useState(false)
  let [physical, setPhysical] = useState(false)
  let [loss, setLoss] = useState(false)
  let [all, setAll] = useState(false)
  let [searchString, setSearchString] = useState(null)
  let [update, setUpdate] = useState(false)
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
  }, [all, emotions, financialOrMaterial, identity, physical, success])
  
  function reset() {
    setPostId(null)
    setString('')
    setSympathyAmount('')
    setUpdate(false)
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
    // If adding new symp type, also update
    // handleUpdateCategory func
    if (all) {
      return 'all'
    } else {
      if (emotions) {
        return 'emotions'
      } else if (financialOrMaterial) {
        return 'financial-or-material'
      } else if (identity) {
        return 'identity'
      } else if (physical) {
        return 'physical'
      } else if (loss) {
        return 'loss'
      }
    }
  }

  function handleUpdateCategory(kind) {
    if (kind === 'Emotion') {
      setEmotions(true)
      setFinancialOrMaterial(false)
      setIdentity(false)
      setPhysical(false)
      setLoss(false)
      setAll(false)
    } else if (kind === 'FinancialOrMaterial') {
      setFinancialOrMaterial(true)
      setEmotions(false)
      setIdentity(false)
      setPhysical(false)
      setLoss(false)
      setAll(false)
    } else if (kind === 'Identity') {
      setIdentity(true)
      setEmotions(false)
      setFinancialOrMaterial(false)
      setPhysical(false)
      setLoss(false)
      setAll(false)
    } else if (kind === 'Physical') {
      setPhysical(true)
      setEmotions(false)
      setFinancialOrMaterial(false)
      setIdentity(false)
      setLoss(false)
      setAll(false)
    } else if (kind === 'Loss') {
      setLoss(true)
      setEmotions(false)
      setFinancialOrMaterial(false)
      setIdentity(false)
      setPhysical(false)
      setAll(false)
    }
  }

  function handlePath() {
    return update ? '/api/sympathy_item_update' : '/api/sympathy_item_create'
  }

  function handleSearch(post) {
    if (searchString) {
      return post.item.match(searchString) !== null || post.sympathyAmount.toString().match(searchString) !== null
    }
    return true
  }

  async function handleDelete(post) {
      const res = await fetch(`/api/sympathy_item_delete`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: post._id,
          type: post.type
        })
      })
      const parsed = await res.json()
      const filtered = data.filter(obj => obj._id !== parsed.id)
      setData(filtered)
  }
  
  return (
    <div
      className='form container'
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch(handlePath(), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: postId,
              strings: string.split(','),
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
          <textarea
            ref={inputRef}
            value={string}
            disabled={update}
            onInput={e => {
              setString(e.target.value)
            }}
          />
          <span className='separate'>Separate strings with a comma</span>
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
                  setLoss(false)
                  setAll(false)
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
                  setLoss(false)
                  setAll(false)
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
                  setLoss(false)
                  setAll(false)
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
                  setLoss(false)
                  setAll(false)
                }}
                checked={physical}
              ></input>
            </label>
            <label
              htmlFor='loss'
            >
              Loss
              <input
                type='radio' 
                name='loss'
                onClick={() => {
                  setLoss(true)
                }}
                onChange={() => {
                  setPhysical(false)
                  setIdentity(false)
                  setFinancialOrMaterial(false)
                  setEmotions(false)
                  setAll(false)
                }}
                checked={loss}
              ></input>
            </label>
          </div>
        </div>
        <button
          className='create-btn'
        >
          {update ? 'Update' : 'Create'}
        </button>
        <button
          style={{ visibility: update ? 'visible' : 'hidden'}}
          className='cancel-btn'
          onClick={e => {
            e.preventDefault()
            setString('')
            setSympathyAmount(0)
            setEmotions(true)
            setFinancialOrMaterial(false)
            setIdentity(false)
            setPhysical(false)
            setUpdate(false)
          }}
        >
          Cancel
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
            <button
              onClick={e => {
                e.preventDefault()
                setAll(true)
              }}
            >
              List All
            </button>
            <input
              type='text'
              placeholder='Search Items'
              onChange={e => {
                setSearchString(e.target.value)
              }}
            ></input>
          </div>
        </div>
        <ul
          className='symp-item-list'
        >
          {data?.sort(compareFn).map((post, i) => {
            if (handleSearch(post)) {
              return (
                <li
                  className='list-item'
                  key={post._id}
                >
                  <span>{i + 1}</span>
                  <span> | </span>
                  <span>{post.item}</span>
                  <span> | </span>
                  <span>{post.sympathyAmount}</span>
                  <button
                    className='update-btn'
                    onClick={e => {
                      e.preventDefault()
                      setPostId(post._id)
                      setString(post.item)
                      setSympathyAmount(post.sympathyAmount)
                      handleUpdateCategory(post.kind)
                      setUpdate(true)
                    }}
                  >
                    u
                  </button>
                  <button
                    className='delete-btn'
                    onClick={async (e) => {
                      e.preventDefault()
                      await handleDelete(post)
                    }}
                  >
                    d
                  </button>
                </li>
              )
            }
          })}
        </ul>
      </div>
    </div>
  )
}

export default SympForm