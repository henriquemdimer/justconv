import { FaSolidArrowUpRightFromSquare } from "solid-icons/fa";
import { RiSystemAlertLine } from "solid-icons/ri";
import Button from "../Button/index.tsx";
import "./index.scss";

export default function NotImplAlert() {
  return (
    <div class="not-impl">
      <i>
        <RiSystemAlertLine />
      </i>
      <span>
        This feature is not implemented yet, but you can help speed things up by
        contributing to our GitHub repository
      </span>
      <Button
        label="Github"
        leftIcon={<FaSolidArrowUpRightFromSquare />}
      />
    </div>
  );
}
