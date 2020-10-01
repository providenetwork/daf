import { TAgent, IIdentityManager, IIdentity } from '../../packages/daf-core/src'
import { ICredentialIssuer } from '../../packages/daf-w3c/src'

type ConfiguredAgent = TAgent<IIdentityManager & ICredentialIssuer>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('creating Verifiable Credentials', () => {
    let agent: ConfiguredAgent
    let identity: IIdentity

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
    })
    afterAll(testContext.tearDown)

    it('should create identity', async () => {
      identity = await agent.identityManagerCreateIdentity({ kms: 'local' })
      expect(identity).toHaveProperty('did')
    })

    it('should create verifiable credential', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identity.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:uport.me',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      expect(verifiableCredential).toHaveProperty('proof.jwt')
    })

    it.todo('should save verifiable credential to the data store')
    it.todo('should get verifiable credential from the data store')
  })
}
