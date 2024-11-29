import { PAGINATION } from "../constants/index.js";
import Bus from "../models/bus.js";
import Trip from "../models/trips.js";
import BusRoutes from "../models/busRoutes.js";
import Seats from "../models/seats.js";

const TripController = {
  createTrip: async (req, res) => {
    try {
      const { route, bus, departureTime, arrivalTime ,status } = req.body;

      const busInfo = await Bus.findById(bus).exec();
      const busRouteInfo = await BusRoutes.findById(route).exec();

      if (!busInfo || !busRouteInfo) {
        return res.status(404).json({
          message: "An error occurred, please try again",
        });
      }

      const trip = await new Trip({
        route,
        bus,
        departureTime,
        arrivalTime,
        status
      }).save();

      res.json(trip);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getTrips: async (req, res) => {
    try {
      const { page = PAGINATION.PAGE, limit = PAGINATION.LIMIT } = req.query;

      const trips = await Trip.find()
        .populate(["route", "bus"])
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();

      const count = await Trip.countDocuments();

      const totalPage = Math.ceil(count / limit);
      const currentPage = Number(page);

      res.json({
        data: trips,
        totalPage,
        currentPage,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getTrip: async (req, res) => {
    try {
      const { id } = req.params;

      const trip = await Trip.findById(id).populate(["route", "bus"]).exec();

      res.json(trip);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateTrip: async (req, res) => {
    try {
      const { id } = req.params;
      const { route, bus, departureTime, arrivalTime ,status} = req.body;

      const busInfo = await Bus.findById(bus).exec();
      const busRouteInfo = await BusRoutes.findById(route).exec();

      if (!busInfo || !busRouteInfo) {
        return res.status(404).json({
          message: "An error occurred, please try again",
        });
      }

      const newTrip = await Trip.findByIdAndUpdate(
        id,
        {
          route,
          bus,
          departureTime,
          arrivalTime,
          status
        },
        { new: true }
      ).exec();

      res.json(newTrip);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  removeTrip: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Trip.findById(id).exec();
      const route = await BusRoutes.findById(data.route).exec();
      const bus = await Bus.findById(data.bus).exec();

    

      const trip = await Trip.findByIdAndDelete(id).exec();

      res.json(trip);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  getTripsByRoute: async (req, res) => {
    try {
      // Bước 1: Lấy dữ liệu từ request
      const { startProvince, endProvince, departureDate } = req.query;
      console.log(
        "startProvince:",
        startProvince,
        "endProvince:",
        endProvince,
        "departureDate:",
        departureDate
      );

      // Bước 2: Tìm tuyến xe theo startProvince và endProvince
      const routes = await BusRoutes.find({
        startProvince,
        endProvince,
      }).exec();

      // Bước 2.1: Kiểm tra nếu không tìm thấy tuyến xe
      if (routes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tuyến xe phù hợp." });
      }

      // Bước 2.2: Lấy danh sách ID của các tuyến xe tìm thấy
      const routeIds = routes.map((route) => route._id);

      // Bước 3: Tạo điều kiện truy vấn chuyến đi theo danh sách ID tuyến xe
      const tripsQuery = { route: { $in: routeIds } };

      // Bước 4: Xử lý logic về thời gian khởi hành
      if (departureDate) {
        const startOfDay = new Date(
          new Date(departureDate).setUTCHours(0, 0, 0, 0)
        );
        const endOfDay = new Date(
          new Date(departureDate).setUTCHours(23, 59, 59, 999)
        );
        tripsQuery.departureTime = { $gte: startOfDay, $lte: endOfDay };
      } else {
        tripsQuery.departureTime = { $gte: new Date() };
      }

      // Bước 5: Thực hiện truy vấn chuyến đi
      const trips = await Trip.find(tripsQuery)
        .populate(["route", "bus"])
        .exec();

      // Bước 6: Kiểm tra nếu không có chuyến xe phù hợp
      if (trips.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy chuyến xe phù hợp." });
      }

      // Bước 7: Trả về danh sách chuyến xe phù hợp
      return res.status(200).json({ trips });
    } catch (error) {
      console.error("Error occurred:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  // getTripsByRoute: async (req, res) => {
  //   try {
  //     // Bước 1: Lấy dữ liệu từ request
  //     const { startProvince, endProvince, departureDate } = req.query;
  //     console.log(
  //       "startProvince:",
  //       startProvince,
  //       "endProvince:",
  //       endProvince,
  //       "departureDate:",
  //       departureDate
  //     );

  //     // Bước 2: Tìm tuyến xe theo startProvince và endProvince
  //     const routes = await BusRoutes.find({
  //       startProvince,
  //       endProvince,
  //     }).exec();

  //     // Bước 2.1: Kiểm tra nếu không tìm thấy tuyến xe
  //     if (routes.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "Không tìm thấy tuyến xe phù hợp." });
  //     }

  //     // Bước 2.2: Lấy danh sách ID của các tuyến xe tìm thấy
  //     const routeIds = routes.map((route) => route._id);

  //     // Bước 3: Tạo điều kiện truy vấn chuyến đi theo danh sách ID tuyến xe
  //     const tripsQuery = { route: { $in: routeIds } };

  //     // Bước 4: Xử lý logic về thời gian khởi hành
  //     if (departureDate) {
  //       // Nếu người dùng có nhập ngày khởi hành
  //       const startOfDay = new Date(
  //         new Date(departureDate).setUTCHours(0, 0, 0, 0)
  //       );
  //       const endOfDay = new Date(
  //         new Date(departureDate).setUTCHours(23, 59, 59, 999)
  //       );
  //       tripsQuery.departureTime = { $gte: startOfDay, $lte: endOfDay };
  //     } else {
  //       // Nếu không có ngày khởi hành, tìm các chuyến xe từ hiện tại đến tương lai
  //       tripsQuery.departureTime = { $gte: new Date() };
  //     }

  //     // Bước 5: Thực hiện truy vấn chuyến đi
  //     const trips = await Trip.find(tripsQuery)
  //       .populate(["route", "bus"])
  //       .exec();

  //     // Bước 6: Kiểm tra nếu không có chuyến xe phù hợp
  //     if (trips.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "Không tìm thấy chuyến xe phù hợp." });
  //     }

  //     // Bước 7: Trả về danh sách chuyến xe phù hợp
  //     return res.status(200).json({ trips });
  //   } catch (error) {
  //     // Xử lý lỗi
  //     console.error("Error occurred:", error);
  //     res
  //       .status(500)
  //       .json({ message: "Internal server error", error: error.message });
  //   }
  // },
  getBusAndSeatsByTripId: async (req, res) => {
    try {
      // Lấy ID chuyến xe từ params
      const { id } = req.params;

      // Bước 1: Tìm chuyến xe theo tripId và populate bus
      const trip = await Trip.findById(id).populate("bus");

      // Bước 2: Kiểm tra nếu không tìm thấy chuyến xe
      if (!trip) {
        return res.status(404).json({ message: "Không tìm thấy chuyến xe." });
      }

      // Bước 3: Lấy thông tin xe buýt từ chuyến xe
      const bus = trip.bus;

      // Bước 4: Kiểm tra nếu không tìm thấy xe buýt
      if (!bus) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy xe buýt cho chuyến này." });
      }

      // Bước 5: Lấy danh sách ghế thuộc chiếc xe
      const seats = await Seats.find({ bus: bus._id }); // Kiểm tra liên kết giữa ghế, xe và chuyến

      // Bước 5.1: Kiểm tra nếu không có ghế nào
      if (!seats.length) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy ghế cho chuyến này." });
      }

      // Bước 6: Trả về thông tin xe buýt và ghế
      return res.status(200).json({ bus, seats });
    } catch (error) {
      console.error("Error occurred:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

export default TripController;
