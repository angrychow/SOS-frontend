import { Table, Tag } from "@douyinfe/semi-ui"
import axios from "axios"
import { useEffect, useState } from "react"

function MMUTable(props) {
  const [datas, setDatas] = useState([])
  useEffect(() => {
    (async function() {
      const processInfo = (await axios.get('/api/info')).data
      const mmuInfo = (await axios.get('/api/mmu_info')).data
      const data = []
      for(const keyProcess in processInfo.pages) {
        var nameProcess = processInfo.pcbList.find((item) => item.PCBID === parseInt(keyProcess, 10))?.ProcessName
        if(!nameProcess) {
          nameProcess = "UNKNOWN_PROCESS"
        }
        const pageList = processInfo.pages[keyProcess]
        for(const virAddr in pageList) {
          if(!pageList[virAddr].Valid) continue
          data.push({
            phyAddr: pageList[virAddr].PhyPage,
            dirty: pageList[virAddr].Dirty,
            pcbid: keyProcess,
            processName: nameProcess,
            pageLastVisit: mmuInfo.pageLastVisit[pageList[virAddr].PhyPage]
          })
        }
      }
      data.sort((a, b) => a.phyAddr - b.phyAddr)
      setDatas(data)
      console.log(processInfo, mmuInfo)
    })()
  }, [props.tick])
  const columns = [
    {
      title: '物理页框',
      dataIndex: 'phyAddr',
    },
    {
      title: 'PCBID',
      dataIndex: 'pcbid',
    },
    {
      title: '进程名',
      dataIndex: 'processName',
    },
    {
      title: '最后一次访问',
      dataIndex: 'pageLastVisit'
    },
    {
      title: '是否脏页',
      dataIndex: 'dirty',
      render: (_, record) => {
        return (
          <Tag
            size='default'
            color={ record.dirty ? 'light-blue' :  'amber'}
          >{ record.dirty ? '是' : '否' }</Tag>
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

export default MMUTable