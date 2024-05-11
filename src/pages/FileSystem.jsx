import axios from "axios";
import {
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
  ChonkyIconName,
  ChonkyActions,
  defineFileAction
} from "chonky";
import { useEffect, useState, useMemo } from "react";
import { Modal, Form, Button, Notification, Toast } from "@douyinfe/semi-ui"

export function FileSystem(props) {
  const createFile = defineFileAction({
    id: 'create_file',
    button: {
      name: 'Create File',
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.folderCreate,
    },
  })
  const deleteFile = defineFileAction({
    id: 'delete_file',
    button: {
      name: 'Delete File',
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.fallbackIcon,
    },
  })
  const fileActions = [createFile, deleteFile, ChonkyActions.OpenFiles, ChonkyActions.OpenFileContextMenu]
  const [path, setPath] = useState(['root'])
  const [createVisible, setCreateVisible] = useState(false);
  const [files, setFiles] = useState([])
  useEffect(() => {
    axios.post("/api/find", {
      path: path.join("/"),
    }).then((resp) => {
      console.log(resp.data)
      setFiles(resp.data.Sons.map(item => {
        const icon = (() => {
          if(item.Type === 'DEVICES') {
            return ChonkyIconName.config
          } else if(item.Type === 'DIRECTORY') {
            return ChonkyIconName.folder
          } else {
            return ChonkyIconName.file
          }
        })()
        return {
          id: item.FilePath,
          name: item.Name,
          ext: '',
          isDir: item.Type === 'DIRECTORY',
          contents: item.contents ,
          icon
        } 
      }))
    })
  },[path, props.tick])
  const handler = (e) => {
    // if(data.)
    console.log(e)
    switch(e.id) {
      case 'create_file':
        setCreateVisible(true)
        break;
      case 'open_files':
        if(e.payload.files[0].isDir) {
          setPath(e.payload.files[0].id.split('/'))
        } else {
          props.show(e.payload.files[0].contents)
        }
        break
      case 'delete_file':
        // console.log(e.state.selectedFiles[0].id)
        axios.post('/api/delete', { path: e.state.selectedFiles[0].id }).then(() =>{
          setPath([...path])
          Toast.info(`删除 ${e.state.selectedFiles[0].id} 成功`)
        }).catch(err => {
          Toast.error(`删除 ${e.state.selectedFiles[0].id} 失败`)
        })
        break;
      default:
        break;
    }
  }
  const folderChain = useMemo(() => {
    let ret = []
    let str = ""
    for(var item of path) {
      if(str !== "") {
        str += "/"
      }
      str += item
      ret.push({
        id: str,
        name: item,
        isDir: true
      })
    }
    return ret
  }, [path])
  return (
    <div style={{ height: '90vh',marginTop: '10px' }}>
      <FileBrowser files={files} folderChain={folderChain} onFileAction={handler} fileActions={fileActions}>
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
      <Modal visible={createVisible} onCancel={() => { setCreateVisible(false) }} footer={<></>}>
        <Form layout="vertical" onSubmit={ (data) => {
          console.log(data)
          axios.post('/api/create', data).then((resp) => {
            Notification.success({
              content: "创建文件成功"
            })
            setPath([...path])
            setCreateVisible(false)
          }).catch(err => {
            Notification.error({
              content: "创建文件失败"
            })
            console.log(err)
          })
        }}>
          <Form.Input label="文件名" field="filename" />
          <Form.Select label="文件类型" field="filetype" initValue={"DIRECTORY"}>
            <Form.Select.Option value="DIRECTORY">文件夹</Form.Select.Option>
            <Form.Select.Option value="FILE">文件</Form.Select.Option>
            <Form.Select.Option value="DEVICES">设备文件</Form.Select.Option>
          </Form.Select>
          <Form.Input label="设备类型（仅设备文件）" field="deviceName" />
          <Form.Input label="文件路径" field="path" initValue={path.join('/')} />
          <Form.TextArea label="文件内容" field="content" />
          <Button htmlType="submit">提交</Button>
        </Form>
      </Modal>
    </div>
  );
}
