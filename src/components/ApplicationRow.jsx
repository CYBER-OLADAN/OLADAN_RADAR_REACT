import React from "react";
import { Badge } from "../ui/Badge";

const ApplicationRow = ({ application, onWithdraw }) => {
  const statusBadge = (
    <Badge
      variant={
        application.status === "pending"
          ? "warning"
          : application.status === "accepted"
            ? "success"
            : "danger"
    }
  >
    {application.status}
  </Badge>
);

return (
  <tr>
    <td>
      <strong>{application.propertyTitle}</strong>
      <br />
      <small>{application.submittedDate}</small>
    </td>
    <td>{statusBadge}</td>
    <td>
      <button
        className="btn btn-link text-danger"
        onClick={() => onWithdraw && onWithdraw(application.id)}
      >
        Withdraw
      </button>
    </td>
  </tr>
);