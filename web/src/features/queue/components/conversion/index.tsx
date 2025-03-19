import Button from "@/components/ui/button";
import { Dropdown, DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown";
import Tag from "@/components/ui/tag";
import FormatsTable from "../formats-table";
import { useState } from "react";
import { FaAngleDown, FaRegTrashCan, FaDownload } from "react-icons/fa6";
import Checkbox from "@/components/ui/checkbox";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ConversionFormat, ConversionStatus } from "@/lib/core/conversion";
import { app } from "@/lib";

export interface ConversionProps {
    id: string;
    name: string;
    size: string;
    format: ConversionFormat;
    status: ConversionStatus;
    onCheck?: (state: boolean) => void
    isChecked?: boolean;
}

export default function Conversion(props: ConversionProps) {
    const [formatSelectionMenuActive, setFormatSelectionMenuActive] = useState(false);
    const [actionsMenuActive, setActionsMenuActive] = useState(false);

    function onFormatSelect(format: string) {
        const conv = app.state.reducers.queue.data.queue.get(props.id);
        if (conv) {
            conv.setFormat(format);
            app.state.dispatch(app.state.reducers.queue.set(conv));
            setFormatSelectionMenuActive(false);
        }
    }

    function toggleFormatSelectionMenu() {
        if (props.status === ConversionStatus.WAITING)
            setFormatSelectionMenuActive(!formatSelectionMenuActive)
    }

    return (
        <>
            <td><Checkbox isChecked={props.isChecked} onChange={props.onCheck} /></td>
            <td>{props.name}</td>
            <td><Tag color={`${props.status === ConversionStatus.WAITING ?
                "default" : props.status === ConversionStatus.DONE ?
                    "success" : "warn"}`}
            >{props.status}</Tag></td>
            <td>
                <Dropdown onClose={() => setFormatSelectionMenuActive(false)} active={formatSelectionMenuActive}>
                    <Button onClick={() => toggleFormatSelectionMenu()} variant="outline" size="sm" endContent={<FaAngleDown />}>
                        {props.format.to ? (
                            <span>{props.format.from.toUpperCase()} -&gt; {props.format.to.toUpperCase()}</span>
                        ) : (
                            <span>Format</span>
                        )}
                    </Button>
                    <DropdownMenu>
                        <FormatsTable onSelect={(fmt) => onFormatSelect(fmt)} />
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