import { client } from "../../lib";
import "./index.scss";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function DragNDrop() {
	return (
		<div onClick={async () => client.uploadFiles(await client.ui.askForFiles())} id="drag-n-drop">
			<div>
				<i>
					<IoCloudUploadOutline />
				</i>
				Drop Files or Click Here
			</div>
		</div>
	);
}
