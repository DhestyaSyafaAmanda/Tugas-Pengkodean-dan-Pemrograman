document.addEventListener('DOMContentLoaded', () => {
    loadItems();

    // Handle form submission
    document.getElementById('addForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const item = {
            name: document.getElementById('name').value,
            quantity: document.getElementById('quantity').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value
        };

        await fetch('php/add_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        });
        
        e.target.reset();
        loadItems();
    });
});

// Load items from database
async function loadItems() {
    const response = await fetch('php/add_item.php?action=get');
    const items = await response.json();
    
    const tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${parseFloat(item.price).toFixed(2)}</td>
            <td>${item.description || '-'}</td>
            <td>
                <button class="edit" onclick="editItem(${item.id}, '${item.name}', ${item.quantity}, ${item.price}, '${item.description || ''}')">Edit</button>
                <button class="delete" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Delete item
async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        await fetch('php/delete_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });
        loadItems();
    }
}

// Edit item
function editItem(id, name, quantity, price, description) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit Item</h2>
            <form id="editForm">
                <input type="hidden" id="editId" value="${id}">
                <input type="text" id="editName" value="${name}" required>
                <input type="number" id="editQuantity" value="${quantity}" required>
                <input type="number" id="editPrice" value="${price}" step="0.01" required>
                <textarea id="editDescription">${description}</textarea>
                <button type="submit">Save Changes</button>
                <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Handle edit form submission
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedItem = {
            id: document.getElementById('editId').value,
            name: document.getElementById('editName').value,
            quantity: document.getElementById('editQuantity').value,
            price: document.getElementById('editPrice').value,
            description: document.getElementById('editDescription').value
        };

        await fetch('php/update_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem)
        });

        modal.remove();
        loadItems();
    });
}