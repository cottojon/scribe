import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const channels = [
        {
            id: 1,
            name: 'Control',
            displayed: true,
            subSystem: 'Hyper',
            location: 'NPPF',
            program: 'EGS'
          },
          {
            id: 2,
            name: 'Ground',
            displayed: true,
            subSystem: 'Hyper',
            location: 'NPPF',
            program: 'EGS'
          },
          {
            id: 3,
            name: 'Crew',
            displayed: true,
            subSystem: 'Hyper',
            location: 'NPPF',
            program: 'EGS'
          },
          {
            id: 4,
            name: 'Flight',
            displayed: true,
            subSystem: 'Hyper',
            location: 'NPPF',
            program: 'EGS'
          }
    ];
    const clips = [
      {
        id: 1,
        channel_id: 1,
        text: 'CISL. JRPS and Houston Flight',
        speaker: 'James Bearss',
        created_at: '12:48PM',
        updated_at: '12:48PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test1.wav'
      },
      {
        id: 2,
        channel_id: 1,
        text: 'Perform the L minus 15 recorder activation ISL.',
        speaker: 'James Bearss',
        created_at: '12:49PM',
        updated_at: '12:49PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test2.wav'
      },
      {
        id: 3,
        channel_id: 2,
        text: 'ISL copies.',
        speaker: 'Morgan Cole',
        created_at: '12:51PM',
        updated_at: '12:51PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test3.wav'
      },
      {
        id: 4,
        channel_id: 1,
        text: 'JRPS.',
        speaker: 'James Bearss',
        created_at: '12:52PM',
        updated_at: '12:52PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test4.wav'
      },
      {
        id: 5,
        channel_id: 3,
        text: 'JRPS Copies.',
        speaker: 'Andrew Gates',
        created_at: '12:58PM',
        updated_at: '12:58PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test5.wav'
      },
      {
        id: 6,
        channel_id: 1,
        text: 'And Houston Fight.',
        speaker: 'James Bearss',
        created_at: '1:02PM',
        updated_at: '1:02PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test6.wav'
      },
      {
        id: 7,
        channel_id: 4,
        text: 'Houston Flight Copies.',
        speaker: 'Jonathan Brownlee',
        created_at: '1:05PM',
        updated_at: '1:05PM',
        revised: false,
        path_to_file: '../../../assets/audio/Test7.wav'
      }
    ];
    return {channels, clips};
  }
}
