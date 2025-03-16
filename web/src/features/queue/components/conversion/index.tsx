import Button from "@/components/ui/button";
import { Dropdown, DropdownMenu } from "@/components/ui/dropdown";
import Tag from "@/components/ui/tag";
import FormatsTable from "../formats-table";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

export default function Conversion() {
    const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);

    return (
        <>
            <td>convert-this.jpg</td>
            <td><Tag color="default">Waiting</Tag></td>
            <td>
                <Dropdown active={formatSelectionMenuActive}>
                    <Button onClick={() => setFormatSelectionMenuActive(!formatSelectionMenuActive)} variant="outline" size="sm" endContent={<FaAngleDown />}>Format</Button>
                    <DropdownMenu>
                        <FormatsTable />
                    </DropdownMenu>
                </Dropdown>
            </td>
            <td>10 KB</td>
        </>
    )
}