const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sita Gurung",
      role: "Local Resident",
      photo: "/icons/woman.png", // Replace with actual photo or placeholder
      text: "The Lamjung Drops provides the freshest water in the area. Delivery is always on time and the customer support is excellent!",
    },
    {
      id: 2,
      name: "Ram Shrestha",
      role: "Business Owner",
      photo: "/icons/bussiness-man.png",
      text: "I trust their quality and service completely. It's my go-to for all bottled water needs for my shop.",
    },
    {
      id: 3,
      name: "Anita Karki",
      role: "Teacher",
      photo: "/icons/woman.png",
      text: "Affordable prices and eco-friendly packaging! I love supporting local businesses like The Lamjung Drops.",
    },
  ];

  return (
    <section className="bg-[#E6F4FF] py-12 px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-extrabold text-[#005BAA] mb-10 tracking-wide">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ id, name, role, photo, text }) => (
            <div
              key={id}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-[#333333]"
            >
              <img
                src={photo}
                alt={name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <p className="italic mb-4">“{text}”</p>
              <h3 className="font-semibold text-lg text-[#005BAA]">{name}</h3>
              <p className="text-sm text-[#FF3C3C]">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
