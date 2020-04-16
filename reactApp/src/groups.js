import React from 'react';


export class GroupDashboard extends React.Component {
	state = {
		groups: []
	}

	componentDidMount() {
		fetch('http://localhost:8000/api/groups/')
			.then(response => response.json())
			.then(data => {
				this.setState({groups: data});
			})
	}

	createNewGroup = (group) => {
		fetch('http://localhost:8000/api/groups/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(group),
		}).then(response => response.json())
		.then(group => {
			this.setState({groups: this.state.groups.concat([group])});
		});
	}

	updateGroup = (newGroup) => {
		fetch(`http://localhost:8000/api/groups/${newGroup.id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newGroup),
		}).then(response => response.json())
		.then(newGroup => {
			const newGroups = this.state.groups.map(group => {
				if(group.id === newGroup.id) {
					return Object.assign({}, newGroup)
				} else {
					return group;
				}
			});
			this.setState({groups: newGroups});
		});
	}

	deleteGroup = (groupId) => {
		fetch(`http://localhost:8000/api/groups/${groupId}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(() => {
			this.setState({groups: this.state.groups.filter(group => group.id !== groupId)})
		});

	}
	render() {
		return (
			<main className="d-flex justify-content-center my-4">
				<div  className="col-8">
					<GroupList
						groups={this.state.groups}
						onDeleteClick={this.deleteGroup}
						onUpdateClick={this.updateGroup}
					/>
					<ToggleableGroupForm
						onGroupCreate={this.createNewGroup}
					/>
				</div>
			</main>
		)
	}
}

class GroupList extends React.Component {
	render() {
		const groups = this.props.groups.map(group => (
			<EditableGroup
	key={group.id}
	id={group.id}
	name={group.name}
	description={group.description}
	onDeleteClick={this.props.onDeleteClick}
	onUpdateClick={this.props.onUpdateClick}

	/>
		));

		return (
			 <table class="table">
				 <thead>
					  <tr >
						  <th>name</th>
						  <th>description</th>
						  <th>action</th>
					  </tr>
				  </thead>
				{groups}
			 </table>
		);
	}
}

class ToggleableGroupForm extends React.Component {
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
	handleFormSubmit = (group) => {
		this.leaveCreateMode();
		this.props.onGroupCreate(group);
	}
	render() {
		if (this.state.inCreateMode) {
			return (
				<div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
					<GroupForm
						onFormSubmit={this.handleFormSubmit}
						onCancelClick={this.handleCancleClick}></GroupForm>
				</div>

			)
		}
		return (
			<button onClick={this.handleCreateClick} className="btn btn-secondary">
				Add Group
			</button>
		);
	}
}

class GroupForm extends React.Component {
	state = {
		name: this.props.name || '',
		description: this.props.description || ''
	}

	handleFormSubmit = (evt) => {
		evt.preventDefault();
		this.props.onFormSubmit({...this.state});
	}
	handleNameUpdate = (evt) => {
		this.setState({name: evt.target.value});
	}
	handleDescriptionUpdate = (evt) => {
		this.setState({description: evt.target.value});
	}

	render() {
		const buttonText = this.props.id ? 'Update Group': 'Create Group';
		return (
			<form onSubmit={this.handleFormSubmit}>
				<div className="form-group">
					<label>
						Name
					</label>
					<input type="text" placeholder="Enter a name"
						value={this.state.name} onChange={this.handleNameUpdate}
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label>
						Description
					</label>
					<textarea className="form-control" placeholder="Description"
						rows="5" value={this.state.description}
						onChange={this.handleDescriptionUpdate}
					>
						{this.state.description}
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

class EditableGroup extends React.Component {
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
	handleUpdate = (group) => {
		this.leaveEditMode()
		group.id = this.props.id;
		this.props.onUpdateClick(group);
	}

	render() {
		const component_form = () => {
			if(this.state.inEditMode) {
				return (
					<GroupForm
						id={this.props.id}
						name={this.props.name}
						description={this.props.description}
						onCancelClick={this.leaveEditMode}
						onFormSubmit={this.handleUpdate}
					/>
				);
			}
			return(<p></p>)
		}
		const component = () => {
			return (
				<Group
					name={this.props.name}
					description={this.props.description}
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

class Group extends React.Component {
	render() {
		return (
			<tr >
				<td>
					{this.props.name}
				</td>
				<td>
					{this.props.description}
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