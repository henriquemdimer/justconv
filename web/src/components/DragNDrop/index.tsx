import "./index.scss";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function DragNDrop() {
  return (
    <div id="drag-n-drop">
      <input id="fileUpload" type="file" />
      <div>
        <i>
			<IoCloudUploadOutline />
        </i>
        Drop Files or Click Here
      </div>
    </div>
  );
}
