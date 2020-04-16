import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { GroupDashboard } from './groups.js';

class StudentDashboard extends React.Component {
	state = {
		students: []
	}

	componentDidMount() {
		fetch('http://localhost:8000/api/students/')
			.then(response => response.json())
			.then(data => {
				this.setState({students: data});
			})
	}

	createNewStudent = (student) => {
		fetch('http://localhost:8000/api/students/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(student),
		}).then(response => response.json())
		.then(student => {
			this.setState({students: this.state.students.concat([student])});
		});
	}

	updateStudent = (newStudent) => {
		fetch(`http://localhost:8000/api/students/${newStudent.id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newStudent),
		}).then(response => response.json())
		.then(newStudent => {
			const newStudents = this.state.students.map(student => {
				if(student.id === newStudent.id) {
					return Object.assign({}, newStudent)
				} else {
					return student;
				}
			});
			this.setState({students: newStudents});
		});
	}

	deleteStudent = (studentId) => {
		fetch(`http://localhost:8000/api/students/${studentId}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(() => {
			this.setState({students: this.state.students.filter(student => student.id !== studentId)})
		});

	}
	render() {
		return (
			<main className="d-flex justify-content-center my-4">
				<div  className="col-8">
					<StudentList
						students={this.state.students}
						onDeleteClick={this.deleteStudent}
						onUpdateClick={this.updateStudent}
					/>
					<ToggleableStudentForm
						onStudentCreate={this.createNewStudent}
					/>
				</div>
			</main>
		)
	}
}

class StudentList extends React.Component {
	render() {
		const students = this.props.students.map(student => (
			<EditableStudent
	key={student.id}
	id={student.id}
	username={student.username}
	created_at={student.created_at}
	group={student.group}
	onDeleteClick={this.props.onDeleteClick}
	onUpdateClick={this.props.onUpdateClick}

	/>
		));
		return (
			 <table class="table">
				 <thead>
					  <tr >
						  <th>usernam</th>
						  <th>created</th>
						  <th>group</th>
						  <th>action</th>
					  </tr>
				  </thead>
				{students}
			 </table>
		);
	}
}

class ToggleableStudentForm extends React.Component {
	state = {
		inCreateMode: false
	}
	handleCreateClick = () => {
		this.setState({inCreateMode: true});
	}
	leaveCreateMode = () => {
		this.setState({inCreateMode: false});
	}
	handleCancleClick = () => {
		this.leaveCreateMode();
	}
	handleFormSubmit = (student) => {
		this.leaveCreateMode();
		this.props.onStudentCreate(student);
	}
	render() {
		if (this.state.inCreateMode) {
			return (
				<div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
					<StudentForm
						onFormSubmit={this.handleFormSubmit}
						onCancelClick={this.handleCancleClick}></StudentForm>
				</div>
				
			)
		}
		return (
			<button onClick={this.handleCreateClick} className="btn btn-secondary">
				Add User
			</button>
		);
	}
}

class StudentForm extends React.Component {
	state = {
		username: this.props.username || '',
		created_at: this.props.created_at || '',
		group: this.props.group || ''
	}

	handleFormSubmit = (evt) => {
		evt.preventDefault();
		this.props.onFormSubmit({...this.state});
	}
	handleUsernameUpdate = (evt) => {
		this.setState({username: evt.target.value});
	}
	handleGroupUpdate = (evt) => {
		this.setState({group: evt.target.value});
	}

	render() {
		const buttonText = this.props.id ? 'Update Student': 'Create Student';

		return (
			<form onSubmit={this.handleFormSubmit}>
				<div className="form-group">
					<label>
						Username
					</label>
					<input type="text" placeholder="Enter a username"
						value={this.state.username} onChange={this.handleUsernameUpdate}
						className="form-control"
					/>
				</div>
				
				<div className="form-group">
					<label>
						Group
					</label>
					<textarea className="form-control" placeholder="Student group"
						rows="5" value={this.state.group}
						onChange={this.handleGroupUpdate}
					>
						{this.state.group}
					</textarea>
				</div>

				<div className="form-group d-flex justify-content-between">
					<button type="submit" className="btn btn-md btn-primary">
						{buttonText}
					</button>
					<button type="button" className="btn btn-md btn-secondary" onClick={this.props.onCancelClick}>
						Cancel
					</button>
				</div>
			</form>
		)
	}
}

class EditableStudent extends React.Component {
	state = {
		inEditMode: false
	};

	enterEditMode = () => {
		this.setState({inEditMode: true});
	}

	leaveEditMode = () => {
		this.setState({inEditMode: false});
	}
	handleDelete = () => {
		this.props.onDeleteClick(this.props.id);
	}
	handleUpdate = (student) => {
		this.leaveEditMode()
		student.id = this.props.id;
		this.props.onUpdateClick(student);
	}

	render() {
		const component_form = () => {
			if(this.state.inEditMode) {
				return (
					<StudentForm
						id={this.props.id}
						username={this.props.username}
						created_at={this.props.created_at}
						group={this.props.group}
						onCancelClick={this.leaveEditMode}
						onFormSubmit={this.handleUpdate}
					/>
				);
			}
			return(<p></p>)
		}
		const component = () => {
			return (
				<Student
					username={this.props.username}
					created_at={this.props.created_at}
					group={this.props.group}
					onEditClick={this.enterEditMode}
					onDeleteClick={this.handleDelete}
				/>
			)
		}
		return (
			<tbody  style={{boxShadow: '0 0 10px #ccc'}} >
				{component()}
			<div>
				{component_form()}
				</div>
			</tbody>
		)
	}
}

class Student extends React.Component {
	render() {
		return (
			<tr >
				<td>
					{this.props.username}
				</td>
				<td>
					{this.props.created_at}
				</td>
				<td>
					{this.props.group}
				</td>
				<td>
					<div>
						<span onClick={this.props.onEditClick} className="mr-2"><i className="far fa-edit">Edit</i></span>
						<span onClick={this.props.onDeleteClick}><i className="fas fa-trash">Delete</i></span>
					</div>
				</td>
			</tr>
		);
	}
}

// ReactDOM.render(<StudentDashboard />, document.getElementById('root'));
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={StudentDashboard}/>
      <Route path='/groups' component={GroupDashboard}/>
    </Switch>
  </main>
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Students</Link></li>
        <li><Link to='/groups'>Groups</Link></li>
      </ul>
    </nav>
  </header>
)

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))