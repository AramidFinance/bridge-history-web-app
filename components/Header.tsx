import React, { FunctionComponent, useEffect, useState } from 'react';
import aramidLogo from '../public/aramid-logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import getAppConfiguration from '../scripts/common/getAppConfiguration';
import AppConfiguration from '../scripts/interface/configuration/AppConfiguration';
import SourceConnect from './Connect/SourceConnect';

const Header: FunctionComponent = () => {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfiguration>();
  useEffect(() => {
    getAppConfiguration().then(c => {
      setConfig(c);
    });
  }, []);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-16 3xl:px-22 4xl:px-32 pt-6 3xl:pt-8 4xl:pt-12">
      <div className="flex items-center justify-start cursor-pointer">
        <a onClick={() => router.push('/')}>
          <div>
            <div className="tracking-wider 3xl:hidden">
              <Image src={aramidLogo} alt="AramidFinance" title="AramidFinance" width={186} height={64} />
            </div>
            <div className="tracking-wider hidden 3xl:block 4xl:hidden">
              <Image src={aramidLogo} alt="AramidFinance" title="AramidFinance" width={232} height={80} />
            </div>
            <div className="tracking-wider hidden 4xl:block">
              <Image src={aramidLogo} alt="AramidFinance" title="AramidFinance" width={370} height={128} />
            </div>
          </div>
        </a>
      </div>
      <SourceConnect />
    </header>
  );
};

export default Header;
