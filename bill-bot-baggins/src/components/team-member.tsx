import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type TeamMemberProps = {
  href: string;
  email: string;
  firstName: string;
  lastName: string;
};

const TeamMember = ({ href, email, firstName, lastName }: TeamMemberProps) => {
  return (
    <div className='flex flex-col items-center justify-center space-y-2'>
      <Link href={href}>
        <Image
          src='/github-mark-white.png'
          alt='GitHub Invertocat logo'
          width={30}
          height={30}
          quality={95}
        />
      </Link>
      <Link href={`mailto:${email}`}>
        <p className='mr-4 flex flex-col text-center text-sm sm:text-lg'>
          <span className='font-semibold tracking-widest'>{firstName}</span>{' '}
          {lastName}{' '}
        </p>
      </Link>
    </div>
  );
};

export default TeamMember;
