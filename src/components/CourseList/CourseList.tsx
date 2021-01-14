import { Row, Image, Modal, Select, notification, Typography, Rate, Tag } from 'antd'
import Table from 'antd/es/table';
import React, { Component } from 'react'
import { course } from '../../api-service';
require('dotenv').config()
const {REACT_APP_API_URL} = process.env;
const { Option } = Select;
const { Title } = Typography;

class CourseList extends Component {
  state = {
    data: [],
    isVisible: false,
    currentCourse: {
      name: '',
      avatar_url: '',
      category: [[]],
      chapter_count: 0,
      enroll_count: 0,
      fee: 0,
      feedback_count: 0,
      rate: 0,
      owner_name: '',
      short_description: ''
    }
  };
  handleResponse(response: any) {
    debugger
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
    const requestOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token'),
        "x-refresh-token": localStorage.getItem('ref_token')
      }
    };

    fetch(`${REACT_APP_API_URL}/api/courses?limit=100`, requestOptions)
      .then(async (res) => {
        const data = await this.handleResponse(res);
        const listCourses = data.data.array;
        debugger
        this.setState({
          data: listCourses
        })
      });
  }

  deleteCourse = (record: any) => {
    const requestOptions: any = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token'),
        "x-refresh-token": localStorage.getItem('ref_token')
      }
    };

    fetch(`${REACT_APP_API_URL}/api/courses/${record.id}`, requestOptions)
      .then(this.handleResponse)
      .then((res) => {
        debugger
        if (res.status === "Can not delete category has been used!") {
          notification.error({
            message: 'Error!',
            description: 'Can not delete category has been used!'
          })
        } else {
          const newList = this.state.data.filter((category: any) => category.name !== record.name)
          this.setState({
            data: newList
          })
          notification.success({
            message: 'Successfully!',
            description: 'Delete category successfully!'
          })
        }
      });
  }

  showCourseInfoModal = (record: any) => {
    this.setState({
      currentCourse: record,
      isVisible: true
    })
  }

  handleOk = () => {
    this.setState({
      isVisible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      isVisible: false,
    })
  }

  render() {
    const columns = [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        render: (text: any, record: any) => <a onClick={() => this.showCourseInfoModal(record)}>{text}</a>,
      },
      {
        title: 'Teacher',
        dataIndex: 'owner_name',
        key: 'owner_name',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: any) => (
          <span>
            <a onClick={() => this.deleteCourse(record)}>Delete</a>
          </span>
        ),
      },
    ];

    const {data, currentCourse} = this.state;
    return (
      <>
        <Modal title="Course Info" visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Title level={4}>Title. {currentCourse.name}</Title>
          <Row>
            <Image
              width={200}
              src={currentCourse.avatar_url}
            />
            <div style={{ marginLeft: '20px'}}>
              <Rate defaultValue={currentCourse.rate} disabled allowHalf/>
              <Title level={5}>Teacher. {currentCourse.owner_name}</Title>
              <Title level={5}>Price. ${currentCourse.fee}</Title>
            </div>
          </Row>
          <div style={{ marginTop: '15px'}}>
              <p>Number of chapters: {currentCourse.chapter_count} chapters</p>
              <p>Number of students: {currentCourse.enroll_count} students</p>
              <p>Number of feedbacks: {currentCourse.feedback_count} feedbacks</p>
          </div>
          <div>
            <b>Categories: {currentCourse.category[0].map((cat:any) => <Tag color="magenta">{cat}</Tag>)}</b>
            <p><b>Short Description:</b></p>
            <p>{currentCourse.short_description}</p>
          </div>
        </Modal>
        <Table
          columns={columns} dataSource={data}
        />
      </>
    );
  }
}

export default CourseList;