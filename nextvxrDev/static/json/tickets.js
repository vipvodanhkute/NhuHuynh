export const
  Tickets = [
    {
      company: {
        id: 10,
        name: 'Hoàng Long',
        url: 'xe-hoang-long',
        ratings: {
          overall: 1.5,
          ontime: 2,
          bus_quality: 3,
          service: 4.5,
          comments: 126,
        },
        images: [
          'https://thiendia.com/xe-hoang-long.jpg',
        ],
      },
      route: {
        name: 'Hà Nội - Hồ Chí Minh',
        id: 13222,
        schedules: [
          {
            trip_code: 'v2akj8emnloe9DAkd2dsa',
            config: 'ONLINE',
            departure_time: 1544092369,
            pickup_time: 1544092111,
            arrival_time: 1564092999,
            vehicle: 'Ghế ngồi 45 chỗ',
            total_seats: 45,
            available_seats: 12,
            fare: {
              original: 320000,
              discount: 250000,
              discount_rate: 40,
              max: 350000,
            },
            deposit: true,
            services: [
              'PICKUP',
              'OPERATOR_PAYMENT',
            ],
          },
        ],
      },
    },
  ]
