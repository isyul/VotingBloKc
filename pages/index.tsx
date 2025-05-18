import Banner from '@/components/Banner'
import Polls from '@/components/Polls'
import Layout from '@/components/Layout'
import { getPolls } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/App.module.css'

export default function Home({ pollsData }: { pollsData: PollStruct[] }) {
  const dispatch = useDispatch()
  const { setPolls } = globalActions
  const { polls } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setPolls(pollsData))
  }, [dispatch, setPolls, pollsData])

  return (
    <Layout>
      <Banner />
      <div className="mt-6">
        <Polls polls={polls} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data = await getPolls()

  return {
    props: {
      pollsData: JSON.parse(JSON.stringify(data)),
    },
  }
}
