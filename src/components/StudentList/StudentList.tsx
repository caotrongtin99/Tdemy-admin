import { Col, Row, Select, Divider, notification } from 'antd'
import Table from 'antd/es/table';
import React, { Component } from 'react'
const { Option } = Select;

class StudentList extends Component {
    state = {
        data: [],
    };
    handleResponse(response: any) {
        return response.text().then((text: any) => {
          const data = text && JSON.parse(text);
          if (!response.ok) {
            if (response.status === 401) {
              window.location.reload(true);
            }
      
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
      
          return data;
        });
    }
    componentDidMount = () => {
        const requestOptions : any = {
            method: "GET",
            headers: { "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token') }
          };
          debugger
        
        fetch(`http://localhost:3000/api/users`, requestOptions)
        .then(async(res) => {
            const data = await this.handleResponse(res);
            const listUsers = data.data.rows;
            
            this.setState({
                data : listUsers
            })
        });
    }

    handleDeleteUser = (user:any) => {
        const requestOptions : any = {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('token'),
            "x-refresh-token": localStorage.getItem('ref_token') }
          };
        
        fetch(`http://localhost:3000/api/users/${user.id}`, requestOptions)
        .then(async(res) => {
            debugger
            const data = await this.handleResponse(res);
            if (data.result === 0) {
                const newDataSourse = this.state.data.filter((item:any) => item.id !== user.id)
                this.setState({
                    data : newDataSourse
                })
            } else {
                notification.error({
                    message: 'Error!'
                })
            }
        
        });
    }
    render() {
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text:any) => <a>{text}</a>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Action',
              key: 'action',
              render: (text : any, record: any) => (
                <span>
                  <a onClick={() => this.handleDeleteUser(record)}>Delete</a>
                </span>
              ),
            },
          ];
          
        const data = this.state.data;
        return (
            <>
               <Table 
                columns={columns} dataSource={data}
               />
            </>
        );
    }
}

export default StudentList;