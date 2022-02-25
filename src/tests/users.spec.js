const expect = require('chai').expect;
const superagent = require('superagent');
const chai = require('chai');

const request = superagent.agent();


describe('Mutations', () => {
  it('should create a user', async () => {
    const response = await request
      .post('http://localhost:5000/graphql')
      .send({
        query: `
        mutation CreateUser($name: String!, $email: String!, $password: String!,        $phoneNumber: String!, $country: String!) {
          createUser(name: $name, email: $email, password: $password, phone_number: $phoneNumber, country: $country) {
            success
            message
          }
        }
        `,
        variables: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'johndoe123',
          phoneNumber: '08123456789',
          country: 'Nigeria',
        },
      });

    expect(response.body.data.createUser.success).to.be.true;
    expect(response.body.data.createUser.message).to.equal('User created successfully');
  });

  it('should login a user', async () => {
    const response = await request
      .post('http://localhost:5000/graphql')
      .send({
        query: `
          mutation Login($password: String!, $email: String!) {
            login(password: $password, email: $email) {
              success
              message
              token
            }
          }
        `,
        variables: {
          password: 'temitope123',
          email: 'sodiq.agunbiade.4@gmail.com'
        },
      });
    expect(response.body.data.login.success).to.be.true;
    expect(response.body.data.login.message).to.equal('User logged in successfully');
  });

  it('should get all users', async () => {
    const response = await request
      .post('http://localhost:5000/graphql')
      .send({
        query: `
          query Query { getUsers { 
            success
            message
            data {
              _id
              country
              email
              name
              phone_number
              verified
            }
          }
        }
        `,
      });
    expect(response.body.data.getUsers.success).to.be.true;
    expect(response.body.data.getUsers.message).to.equal('Users fetched successfully');
    expect(response.body.data.getUsers.data).to.be.an('array');
    expect(response.body.data.getUsers.data[0]).to.have.all.keys('_id', 'name', 'email', 'phone_number', 'country', 'verified');
  });
});
