const API_URL = '/api/opportunities';

const app = {
    deleteId: null,
    deleteModal: null,
    toast: null,

    init() {
        // Initialize Bootstrap components
        this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        this.toast = new bootstrap.Toast(document.getElementById('appToast'));

        // Event Listeners
        document.getElementById('btnConfirmDelete').addEventListener('click', () => {
            if (this.deleteId) {
                this.deleteOpportunity(this.deleteId);
            }
        });

        // Setup Form Validation styles
        const form = document.getElementById('opportunityForm');
        form.addEventListener('input', (e) => {
            if(e.target.required && e.target.value.trim() === '') {
                e.target.classList.add('is-invalid');
            } else {
                e.target.classList.remove('is-invalid');
            }
        });

        this.loadOpportunities();
    },

    showView(viewName) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
        document.getElementById(viewName + 'View').classList.remove('d-none');
        if (viewName === 'list') {
            this.loadOpportunities();
        }
    },

    showToast(message, type) {
        const toastEl = document.getElementById('appToast');
        const toastMsg = document.getElementById('appToastMessage');
        
        toastEl.classList.remove('toast-success', 'toast-error', 'bg-success', 'bg-danger');
        
        if (type === 'success') {
            toastEl.classList.add('bg-success');
        } else {
            toastEl.classList.add('bg-danger');
        }
        
        toastMsg.textContent = message;
        this.toast.show();
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },
    
    getISODate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    },

    async loadOpportunities() {
        const tableBody = document.getElementById('opportunitiesTableBody');
        const emptyState = document.getElementById('emptyState');
        const tableEl = document.getElementById('opportunitiesTable');
        const spinner = document.getElementById('loadingSpinner');

        tableEl.parentElement.classList.add('d-none');
        emptyState.classList.add('d-none');
        spinner.classList.remove('d-none');

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch opportunities');
            
            const data = await response.json();
            
            spinner.classList.add('d-none');

            if (data.length === 0) {
                emptyState.classList.remove('d-none');
                tableEl.parentElement.classList.add('d-none');
            } else {
                emptyState.classList.add('d-none');
                tableEl.parentElement.classList.remove('d-none');
                
                tableBody.innerHTML = data.map(opp => `
                    <tr>
                        <td><strong>${this.escapeHtml(opp.title)}</strong></td>
                        <td>${this.escapeHtml(opp.research_area)}</td>
                        <td>${this.escapeHtml(opp.faculty_name)}</td>
                        <td>${this.formatDate(opp.application_deadline)}</td>
                        <td>
                            <span class="badge ${opp.status === 'Open' ? 'bg-success' : 'bg-secondary'}">
                                ${opp.status}
                            </span>
                        </td>
                        <td class="text-end text-nowrap">
                            <button class="btn btn-sm btn-info text-white" onclick="app.viewOpportunity(${opp.id})" title="View Details">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="app.showEditForm(${opp.id})" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-warning text-dark" onclick="app.toggleStatus(${opp.id}, '${opp.status}')" title="Toggle Status">
                                <i class="bi bi-arrow-left-right"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.confirmDelete(${opp.id})" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            spinner.classList.add('d-none');
            this.showToast(error.message, 'error');
        }
    },

    async viewOpportunity(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch details');
            const opp = await response.json();

            document.getElementById('detailTitle').textContent = opp.title;
            
            const statusBadge = document.getElementById('detailStatus');
            statusBadge.textContent = opp.status;
            statusBadge.className = `badge rounded-pill fs-6 ${opp.status === 'Open' ? 'bg-success' : 'bg-secondary'}`;

            document.getElementById('detailDepartment').textContent = opp.department;
            document.getElementById('detailFaculty').textContent = opp.faculty_name;
            document.getElementById('detailArea').textContent = opp.research_area;
            document.getElementById('detailDeadline').textContent = this.formatDate(opp.application_deadline);
            document.getElementById('detailPositions').textContent = opp.available_positions || 'Not specified';
            document.getElementById('detailDescription').textContent = opp.description || 'No description provided.';
            document.getElementById('detailSkills').textContent = opp.required_skills || 'None specified.';
            
            document.getElementById('btnEditFromDetail').onclick = () => this.showEditForm(id);

            this.showView('detail');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    showCreateForm() {
        document.getElementById('formTitle').textContent = 'Create New Opportunity';
        document.getElementById('opportunityForm').reset();
        document.getElementById('formId').value = '';
        
        // Remove validation styling
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        
        this.showView('form');
    },

    async showEditForm(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch details for editing');
            const opp = await response.json();

            document.getElementById('formTitle').textContent = 'Edit Opportunity';
            document.getElementById('formId').value = opp.id;
            
            document.getElementById('title').value = opp.title || '';
            document.getElementById('research_area').value = opp.research_area || '';
            document.getElementById('department').value = opp.department || '';
            document.getElementById('faculty_name').value = opp.faculty_name || '';
            document.getElementById('application_deadline').value = this.getISODate(opp.application_deadline);
            document.getElementById('available_positions').value = opp.available_positions || '';
            document.getElementById('status').value = opp.status || 'Open';
            document.getElementById('description').value = opp.description || '';
            document.getElementById('required_skills').value = opp.required_skills || '';

            // Remove validation styling
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

            this.showView('form');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    async handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        if (!form.checkValidity()) {
            // Trigger native validation UI
            form.reportValidity();
            return;
        }

        const btnSubmit = document.getElementById('btnSubmit');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
        btnSubmit.disabled = true;

        const id = document.getElementById('formId').value;
        const isEdit = !!id;

        const formData = {
            title: document.getElementById('title').value,
            research_area: document.getElementById('research_area').value,
            department: document.getElementById('department').value,
            faculty_name: document.getElementById('faculty_name').value,
            application_deadline: document.getElementById('application_deadline').value,
            available_positions: document.getElementById('available_positions').value ? parseInt(document.getElementById('available_positions').value, 10) : null,
            status: document.getElementById('status').value,
            description: document.getElementById('description').value,
            required_skills: document.getElementById('required_skills').value
        };

        try {
            const url = isEdit ? `${API_URL}/${id}` : API_URL;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Failed to save opportunity');
            }

            this.showToast(`Opportunity successfully ${isEdit ? 'updated' : 'created'}`, 'success');
            this.showView('list');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    },

    async toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
        
        try {
            // First get the current opportunity to update it completely if API requires full PUT,
            // or just send PATCH/PUT with status. Assuming PUT requires full object or partial is supported.
            // A well-designed REST API might support PATCH, but we'll use PUT as instructed, 
            // wait, instructions say: "toggleStatus(id, currentStatus) — PUT to flip Open↔Closed, reload list"
            // Usually, this means we just send { status: newStatus } or we have a specific endpoint.
            // Let's assume we can send just { status: newStatus } for PUT or we might need the full object.
            // Since it's standard Express backend, let's fetch first to be safe, then PUT.
            
            const getRes = await fetch(`${API_URL}/${id}`);
            if (!getRes.ok) throw new Error('Failed to fetch for status toggle');
            const opp = await getRes.json();
            
            opp.status = newStatus;
            
            // Format dates back if needed, but assuming API accepts what it returned
            if(opp.application_deadline) {
                opp.application_deadline = this.getISODate(opp.application_deadline);
            }

            const putRes = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(opp)
            });

            if (!putRes.ok) throw new Error('Failed to update status');

            this.showToast(`Status changed to ${newStatus}`, 'success');
            this.loadOpportunities();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    },

    confirmDelete(id) {
        this.deleteId = id;
        this.deleteModal.show();
    },

    async deleteOpportunity(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete opportunity');

            this.deleteModal.hide();
            this.showToast('Opportunity deleted successfully', 'success');
            this.loadOpportunities();
        } catch (error) {
            this.deleteModal.hide();
            this.showToast(error.message, 'error');
        } finally {
            this.deleteId = null;
        }
    },
    
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return (unsafe + '').replace(/[&<"']/g, function(m) {
            switch (m) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '"': return '&quot;';
                default: return '&#039;';
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
