import { FaAngleRight } from "react-icons/fa6";
import "./index.scss";
import { useState } from "react";
import { Reuleaux } from 'ldrs/react'

export interface FormatsTableProps {
    onSelect?: (format: string) => void;
    isLoading?: boolean;
}

export default function FormatsTable(props: FormatsTableProps) {
    // temporary
    const data: any[] = [];
    const [selectedGroup, setSelectedGroup] = useState("");

    return (
        <div className="formats-table">
            {!props.isLoading ? (
                <>
                    <div className="formats-table__groups">
                        {data.length ? data.map((group) => (
                            <div onMouseEnter={() => setSelectedGroup(group.type)} className={`formats-table__groups__group ${selectedGroup === group.type ? "formats-table__groups__group--active" : ""}`}>
                                <span>{group.type}</span>
                                <i><FaAngleRight /></i>
                            </div>
                        )) : ""}
                    </div>
                    <div className="formats-table__formats">
                        {data.length ? data.find((g) => g.type === selectedGroup)?.formats.map((format: any) => (
                            <div className="formats-table__formats__format">{format.name}</div>
                        )) : ""}
                    </div>
                </>
            ) : (
                <div className="formats-table__loader">
                    <i>
                        <Reuleaux
                            size="37"
                            stroke="5"
                            stroke-length="0.15"
                            bg-opacity="0.5"
                            speed="1.2"
                            color="var(--primary)"
                        />
                    </i>
                </div>
            )}
        </div >
    )
}