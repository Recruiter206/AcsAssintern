import axios from 'axios'

const Base_Url = 'http://localhost:5000/api'

export const getUser = () => axios.get(`${Base_Url}/users`)

export const createUser = (data) => axios.post(`${Base_Url}/create`,data)
export const updateUser = (id,data) => axios.put(`${Base_Url}/update/${id}`,data)
export const deleteUser = (id) => axios.delete(`${Base_Url}/delete/${id}`)

