import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../lib/utils';

type LogoProps = {
  className?: string;
  size: 'small' | 'large';
};

export default function Logo({ className, size }: LogoProps) {
  const imageSize = size === 'small' ? 200 : 200;

  return (
    <Link className={cn(className)} href='/'>
      <Image
        src={'/logo-transparent.svg'}
        alt='PayStream Logo'
        width={imageSize}
        height={imageSize}
      />
    </Link>
  );
}
