import "./index.scss";
import { AiOutlineCloudUpload } from "solid-icons/ai";

export default function DragNDrop() {
  return (
    <div id="drag-n-drop">
      <input id="fileUpload" type="file" />
      <div>
        <i>
          <AiOutlineCloudUpload />
        </i>
        Drop Files or Click Here
      </div>
    </div>
  );
}
