import { Table, Tag } from "@douyinfe/semi-ui"
import axios from "axios"
import { useEffect, useState } from "react"

function DevicesTable(props) {
  const [datas, setDatas] = useState([])
  useEffect(() => {
    axios.get('/api/device_table').then(data => {
      setDatas(
        Object.keys(data.data).map((key) => {
          return {
            deviceName: key ,
            state: data.data[key]
          }
        })
      )
    })
  }, [props.tick])
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '设备状态',
      dataIndex: 'state',
      render: (_, record) => {
        return (
          <Tag
            size='default'
            color={ record.state === 'AVAILABLE' ? 'light-blue' :  'amber'}
          >{ record.state === 'AVAILABLE' ? '可用' : '不可用' }</Tag>
        )
      }
    },
  ]
  return (
    <>
      <Table columns={columns} dataSource={datas} pagination={{ pageSize: 10 }} />
    </>
  )
}

export default DevicesTable