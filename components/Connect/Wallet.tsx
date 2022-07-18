import { StaticImageData } from 'next/image';
import Image from 'next/image';
interface WalletProps {
  name: string;
  logo?: string | StaticImageData;
  connect: any;
}
const Wallet = (props: WalletProps): JSX.Element => {
  const { name, logo, connect } = props;
  return (
    <div
      className={`
        bg-gradient-[90deg] from-network-btn-tl to-network-btn-br border border-[#47556980] 
        rounded-full 
        m-1 3xl:m-3 4xl:m-5
        ease-in-out duration-100 hover:bg-white-rgba-0.3 flex flex-row 
        py-1.5 3xl:py-2.5 4xl:py-5
        px-2.5 3xl:px-4 4xl:px-6
      `}
      onClick={() => connect()}
      key={'connect-walletconnect'}
    >
      {' '}
      {!!logo ? (
        <div className="pt-2 3xl:pt-3 4xl:pt-4">
          <div className="self-center 3xl:hidden 4xl:hidden">
            <Image src={logo} width={'30px'} height={'30px'} alt={'walletconnect'} />
          </div>
          <div className="self-center hidden 3xl:block 4xl:hidden">
            <Image src={logo} width={'42px'} height={'42px'} alt={'walletconnect'} />
          </div>
          <div className="self-center hidden 4xl:block">
            <Image src={logo} width={'60px'} height={'60px'} alt={'walletconnect'} />
          </div>
        </div>
      ) : (
        <div />
      )}
      <div className="mr-2.5"></div> {/* space between logo and name */}
      <div className="flex flex-col justify-center text-xl 3xl:text-2xl 4xl:text-3xl m-auto">{name}</div>
      {/* name of network */}
    </div>
  );
};

export default Wallet;
