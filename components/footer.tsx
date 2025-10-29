"use client"
import Link from "next/link";
import Image from "next/image"
export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
              {/*  logo */}
              <Image src="/logo-white.png" alt="E-Africa Logo" width={140} height={140} />            
            </div>
            </Link>
            </div>
            <p className="text-background/80">Redefining learning. Empowering Africa.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  For Companies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  For Individuals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Training Programs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Talent Pool
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="mailto:info@eafricaservices.com" className="hover:text-background transition-colors">
                  info@eafricaservices.com
                </a>
              </li>
              <li>
                <a href="tel:+234" className="hover:text-background transition-colors">
                  +234 (0) XXX XXX XXXX
                </a>
              </li>
              <li className="pt-2">
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.linkedin.com/company/e-africa-services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://x.com/empower__africa?s=21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    X/Twitter
                  </a>
                  <a
                    href="https://web.facebook.com/profile.php?id=61562074914381"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/e.africa1?igsh=MWhuanR1ODh4NGZmcA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@e_africa01?_t=ZS-8zrl8nXXinB&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://youtube.com/@e-africaserices?si=CbConmy1ptbJny3Z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    YouTube
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/80 text-sm">© 2025 E-Africa Services. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
