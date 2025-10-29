"use client"
import Image from 'next/image';

const teamMembers = [
  {
    name: "Clinton Imemeh",
    role: "Founder & CEO",
    image: "/clinton.jpg",
  },
  {
    name: "Gideon Adesoji",
    role: "Operations Manager",
    image: "/gideon.jpg",
  },
  {
    name: "Paul Joel Osagie",
    role: "Backend Cloud Engineer",
    image: "/paul.jpg",
  },
  {
    name: "Godstime Erubami",
    role: "Fullstack Engineer",
    image: "/gt.jpg",
  },
  {
    name: "Abigail Patrick",
    role: "Digital Marketer",
    image: "/abigail.jpg",
  },
 
]

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground">
            Passionate professionals dedicated to transforming Africa's future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="group">
              <div className="relative mb-4 overflow-hidden rounded-lg bg-muted h-80">
                <Image
                  fill
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
