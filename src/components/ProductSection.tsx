import { Briefcase, Home, User } from "lucide-react"
import Image from "next/image"

const services = [
  {
    title: "Kredit Produktif",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    icon: <Image src="services-1.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
  },
  {
    title: "Kredit Multiguna",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    icon: <Image src="services-2.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
  },
  {
    title: "KPR",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    icon: <Image src="services-3.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
  },
  {
    title: "Dana Pensiun",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    icon: <Image src="services-3.svg" alt="illustration" width={100} height={100} className="w-12 h-12 text-blue-500 mx-auto" />,
  },

]

export default function ServicesSection() {
  return (
    <section className="py-8">
      <h2 className="text-3xl font-medium text-center text-black mb-12">
        Produk Kami
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 px-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-10 text-center hover:shadow-xl transition-shadow"
          >
            {service.icon}
            <h3 className="text-xl font-bold mt-4">{service.title}</h3>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}