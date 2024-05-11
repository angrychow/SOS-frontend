import { TextArea } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";

function Logs(props) {
  const [content, setContent] = useState("")
  useEffect(() => {
    console.log(props.logs)
    setContent(props.logs)
  }, [props.logs])
  return (
    <TextArea autosize value={content} style={{ margin: "10px" }} />
  )
}

export default Logs