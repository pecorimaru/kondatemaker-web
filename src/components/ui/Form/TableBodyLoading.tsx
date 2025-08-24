import { LoadingSpinner } from "@/components/ui";

export const TableBodyLoading = () => {
    return (
      <tbody className="flex justify-center">
        <tr className="pt-4">
          <td>
            <LoadingSpinner />
          </td>
        </tr>
      </tbody>
    );
  };
  