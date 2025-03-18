import Button from "@/components/ui/button";
import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import Tag from "@/components/ui/tag";
import FormatsTable from "../formats-table";
import { useState } from "react";
import { FaAngleDown, FaRegTrashCan, FaDownload } from "react-icons/fa6";
import Checkbox from "@/components/ui/checkbox";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ConversionFormat } from "@/lib/core/conversion";

export interface ConversionProps {
    id: string;
    name: string;
    size: string;
    format: ConversionFormat;
    status: string;
    onCheck?: (state: boolean) => void
    isChecked?: boolean;
}

export default function Conversion(props: ConversionProps) {
    const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);
    const [actionsMenuActive, setActionsMenuActive] = useState(false);

    return (
        <>
            <td><Checkbox isChecked={props.isChecked} onChange={props.onCheck} /></td>
            <td>{props.name}</td>
            <td><Tag color="default">{props.status}</Tag></td>
            <td>
                <Dropdown onClose={() => setFormatSelectionMenuActive(false)} active={formatSelectionMenuActive}>
                    <Button onClick={() => setFormatSelectionMenuActive(!formatSelectionMenuActive)} variant="outline" size="sm" endContent={<FaAngleDown />}>
                        {props.format.to ? (
                            <span>{props.format.from} -&gt; {props.format.to}</span>
                        ) : (
                            <span>Format</span>
                        )}
                    </Button>
                    <DropdownMenu>
                        <FormatsTable isLoading />
                    </DropdownMenu>
                </Dropdown>
            </td>
            <td>{props.size}</td>
            <td>
                <Dropdown active={actionsMenuActive} onClose={() => setActionsMenuActive(false)}>
                    <Button onClick={() => setActionsMenuActive(!actionsMenuActive)} variant="outline" isIconOnly size="sm" startContent={<BsThreeDotsVertical />} />
                    <DropdownMenu side="right">
                        <DropdownMenuItem startContent={<FaDownload />}>Download</DropdownMenuItem>
                        <DropdownMenuItem color="danger" startContent={<FaRegTrashCan />}>Remove</DropdownMenuItem>
                    </DropdownMenu>
                </Dropdown>
            </td>
        </>
    )
}