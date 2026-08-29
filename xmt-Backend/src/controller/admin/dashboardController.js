import { getAllTotal } from "../../service/admin/dashboardService";

const handleGetAllTotal = async (req, res) => {
  try {
    let data = await getAllTotal();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

export { handleGetAllTotal };
