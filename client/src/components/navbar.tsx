{/* Assuming this is part of a larger component,  adjust as needed */}
import Link from 'next/link';
import cn from 'classnames';

function Navbar({ segment }) {
  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    // ... more items
  ];


  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;