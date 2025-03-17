import Button from "@/components/ui/button";
import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import Tag from "@/components/ui/tag";
import FormatsTable from "../formats-table";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import Checkbox from "@/components/ui/checkbox";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Conversion() {
    const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);
    const [actionsMenuActive, setActionsMenuActive] = useState(false);

    return (
        <>
            <td><Checkbox /></td>
            <td>convert-this.jpg</td>
            <td><Tag color="default">Waiting</Tag></td>
            <td>
                <Dropdown onClose={() => setFormatSelectionMenuActive(false)} active={formatSelectionMenuActive}>
                    <Button onClick={() => setFormatSelectionMenuActive(!formatSelectionMenuActive)} variant="outline" size="sm" endContent={<FaAngleDown />}>Format</Button>
                    <DropdownMenu>
                        <FormatsTable isLoading />
                    </DropdownMenu>
                </Dropdown>
            </td>
            <td>10 KB</td>
            <td>
                <Dropdown active={actionsMenuActive} onClose={() => setActionsMenuActive(false)}>
                    <Button onClick={() => setActionsMenuActive(!actionsMenuActive)} variant="outline" isIconOnly size="sm" startContent={<BsThreeDotsVertical />} />
                    <DropdownMenu side="right">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem color="danger">Remove</DropdownMenuItem>
                    </DropdownMenu>
                </Dropdown>
            </td>
        </>
    )
}