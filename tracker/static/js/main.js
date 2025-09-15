import axios from './axios.js';

document.addEventListener('DOMContentLoaded', fetchProjects);

function fetchProjects() {
  console.log('Fetching projects from:', axios.defaults.baseURL + 'projects/');
  
  axios.get('projects/')
    .then(res => {
      if (res.data.length === 0) {
        document.querySelector('#projectList').innerHTML = '<p class="text-muted">No projects found.</p>';
        return;
      }

      const list = res.data.map(p => `
        <div class="card mt-2 p-2">
          <h5>${p.title} - ${p.status}</h5>
          <p>${p.description}</p>
          <p>Due: ${p.due_date}, Priority: ${p.priority}</p>
          ${p.status !== 'completed' ? `<button onclick="markComplete(${p.id})" class="btn btn-success btn-sm">Mark Complete</button>` : ''}
          ${IS_TRAINER ? `<button onclick="deleteProject(${p.id})" class="btn btn-danger btn-sm">Delete</button>` : ''}
        </div>
      `).join('');

      document.querySelector('#projectList').innerHTML = list;
    })
    .catch(err => {
      console.error('Failed to fetch projects:', err);
      document.querySelector('#projectList').innerHTML = '<p class="text-danger">Failed to load projects.</p>';
    });
}


window.assignProjectForm = function () {
  const form = `
    <div class="card p-3 mt-3">
      <h5>Assign New Project</h5>
      <input id="title" class="form-control" placeholder="Title"><br>
      <textarea id="description" class="form-control" placeholder="Description"></textarea><br>
      <input id="due" type="date" class="form-control"><br>
      <input id="trainee_id" class="form-control" placeholder="Trainee User ID"><br>
      <select id="priority" class="form-select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select><br>
      <button onclick="submitProject()" class="btn btn-primary">Submit</button>
    </div>`;
  document.querySelector('#projectList').innerHTML = form;
}

window.submitProject = function () {
  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    due_date: document.getElementById('due').value,
    assigned_to: document.getElementById('trainee_id').value,
    priority: document.getElementById('priority').value
  };

  axios.post('projects/', data).then(res => {
    alert('Project assigned!');
    fetchProjects();
  });
}

window.markComplete = function (id) {
  axios.put(`projects/${id}/`, { status: 'completed' })
    .then(() => fetchProjects())
    .catch(err => console.error(err));
}

window.deleteProject = function (id) {
  if (confirm("Are you sure?")) {
    axios.delete(`projects/${id}/`)
      .then(() => fetchProjects())
      .catch(err => console.error(err));
  }
}
