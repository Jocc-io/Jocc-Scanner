import { Twitter, Globe, Bot, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Globe, label: 'Website', url: 'https://jocc.io' },
    {
      icon: Linkedin,
      label: 'Linkedin',
      url: 'https://www.linkedin.com/company/joccnft',
    },
    { icon: Twitter, label: 'Twitter', url: 'https://x.com/joccnft' },
    { icon: Bot, label: 'Discord', url: 'https://discord.gg/jmMY8MrQCt' },
    { icon: Send, label: 'Telegram', url: 'https://t.me/joccnft' },
  ];

  return (
    <footer className="pt-16 md:pt-32 ">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-7 h-7 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110 hover:border-slate-600"
              aria-label={social.label}>
              <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
            </a>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-xs mb-4">
            © 2026 Jocc - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
