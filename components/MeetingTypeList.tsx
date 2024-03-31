"use client"
import HomeCard from "./HomeCard"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModal from "./MeetingModal"
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from 'react-datepicker';
import { Input } from "./ui/input"


const MeetingTypeList = () => {
   const router = useRouter();
   const [meetingState, setMeetingState] =useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting'>()
   const [isHovered, setIsHovered] = useState(false);
   const { user } = useUser();
   const client = useStreamVideoClient();
   const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
   });
   const { toast } = useToast();

   const [callDetails, setCallDetails] = useState<Call>()

   const createMeeting = async () => {
    if (!client || !user) return;

    try {
        if(!values.dateTime) {
            toast({
                title: "Please select a date and time",
              })
        }
        const id = crypto.randomUUID();
        const call = client.call('default', id);

        if(!call) throw new Error('Failed to make call');

        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'New Meeting'

        await call.getOrCreate({
            data: {
                starts_at: startsAt,
                custom: {
                    description
                }
            }
        })
        setCallDetails(call);
        if(!values.description) {
            router.push(`/meeting/${call.id}`)
        }

        toast({
            title: "Meeting Created",
          })

    } catch (e) {
        console.log(e);
        toast({
            title: "Unable to create meeting",
          })
        }
    }

    const meetingLink =  `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
         img='/icons/add-meeting.svg'
         title='New Meeting'
         description='Start a meet'
         handleClick={() => setMeetingState('isInstantMeeting')}
         className='bg-orange-1 hover:bg-orange-2'
         
         />
         <HomeCard 
         img='/icons/schedule.svg'
         title='Schedule Meeting'
         description='Plan meet'
         handleClick={() => setMeetingState('isScheduleMeeting')}
         className='bg-blue-1 hover:bg-blue-2'
         />
         <HomeCard 
         img='/icons/recordings.svg'
         title='Recordings'
         description='View past recordings'
         handleClick={() => router.push('/recordings')}
         className='bg-purple-1 hover:bg-purple-2'
         />
         <HomeCard 
         img='/icons/join-meeting.svg'
         title='Join Meeting'
         description='Via invitation link '
         handleClick={() => setMeetingState('isJoiningMeeting')}
         className='bg-yellow-1 hover:bg-yellow-2'
         />

         {!callDetails ? (
          <MeetingModal 
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
          buttonIcon='/icons/copy.svg'
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">
                Description</label>
                <Textarea className="border-none bg-dark-3
                 focus-visible:ring-0 
                 focus-visible:ring-offset-0"
                 onChange={(e) => {
                  setValues({...values, description: e.target.value})
                 }}/> 
            </div>
            <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
                Select Date and Time</label>
                <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy, h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                />
            </div>
          </MeetingModal>
         ) : (
          <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            buttonIcon='/icons/copy.svg'
            image="/icons/checked.svg"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink)
              toast({ title: 'Link copied'})
            }}
            buttonText='Copy Meeting Link'
            >
            </MeetingModal>
         )}
         <MeetingModal 
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Start an Instant Meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
            buttonIcon='/icons/copy.svg'>
          </MeetingModal>

          <MeetingModal 
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Type the link"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={() => router.push(values.link)}
            buttonIcon='/icons/copy.svg'>
              <Input
               placeholder="Link"
               className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
               onChange={(e) => setValues({...values, link: e.target.value })}/>
          </MeetingModal>
    </section>
  )
}

export default MeetingTypeList 