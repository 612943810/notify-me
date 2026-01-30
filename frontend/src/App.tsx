import { useState, useEffect } from 'react'
import './App.css'

// Define the Item type to match our backend
interface Item {
  id: number
  name: string
  description?: string
  created_at: string
}

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch items from the API
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  // Create a new item
  const createItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          description: newItemDescription.trim() || undefined,
        }),
      })

      if (response.ok) {
        setNewItemName('')
        setNewItemDescription('')
        fetchItems() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete an item
  const deleteItem = async (id: number) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })
      fetchItems() // Refresh the list
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Load items when component mounts
  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="app">
      <header>
        <h1>Boilerplate App</h1>
        <p>A simple FastAPI + React app you can expand on</p>
      </header>

      <main>
        <section className="form-section">
          <h2>Add New Item</h2>
          <form onSubmit={createItem}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter item name..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter item description (optional)..."
                rows={3}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </section>

        <section className="items-section">
          <h2>Items ({items.length})</h2>
          {items.length === 0 ? (
            <p className="empty-state">No items yet. Add one above!</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.name}</h3>
                  {item.description && <p>{item.description}</p>}
                  <small>Created: {new Date(item.created_at).toLocaleString()}</small>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App