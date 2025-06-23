import Image from "next/image"
import Link from "next/link"

const CallToAction = () => {
  return (
    <section className="call-to-action-section">
      <div className="call-to-action-badge">
        Start your learning track!
      </div>
      <h2 className='text-2xl font-bold'>
        Build and Personalize Your Fav Buddy
      </h2>
      <p>
        Begin Learning through Real-Feel Conversations that suits you.
      </p>
      {/* <Image 
        src='/images/cta.svg' 
        alt="calltoaction" 
        width={360} 
        height={360}
      /> */}
      <button className="btn-new-buddies">
        <Image src='/icons/plus.svg' alt="plus" height={12} width={12}/>
        <Link href='/buddies/new'>
          <p>
            Create a new buddy
          </p>
        </Link>
      </button>
    </section>
  )
}

export default CallToAction
