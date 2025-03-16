import Tag from "@/components/ui/tag";
import "./queue.scss";

export default function Queue() {
    return (
        <div id="queue">
            <div id="queue__header">
                <span>Conversion queue</span>
                <span>0 / 3</span>
            </div>
            <div id="queue__table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Format</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>convert-this.jpg</td>
                            <td><Tag color="success">Pending</Tag></td>
                            <td>JPG -&gt; PNG</td>
                            <td>10 KB</td>
                        </tr>
                        <tr>
                            <td>convert-this.jpg</td>
                            <td><Tag>Pending</Tag></td>
                            <td>JPG -&gt; PNG</td>
                            <td>10 KB</td>
                        </tr>
                        <tr>
                            <td>convert-this.jpg</td>
                            <td><Tag>Pending</Tag></td>
                            <td>JPG -&gt; PNG</td>
                            <td>10 KB</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}