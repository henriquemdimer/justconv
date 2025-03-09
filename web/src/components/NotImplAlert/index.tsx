import Button from "../Button/index.tsx";
import "./index.scss";
import { FaLink } from "react-icons/fa6";

export default function NotImplAlert() {
  return (
    <div className="not-impl">
      <i>
      </i>
      <span>
        This feature is not implemented yet, but you can help speed things up by
        contributing to our GitHub repository
      </span>
      <Button
        label="Github"
		leftIcon={<FaLink />}
      />
    </div>
  );
}
