require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@ieee.org';
  const password = 'adminPassword123!';

  console.log('Creating admin user in Auth...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in Auth. Fetching user...');
    } else {
      console.error('Error creating user:', authError);
      return;
    }
  }

  // Fetch the user ID
  const { data: listData } = await supabase.auth.admin.listUsers();
  const user = listData.users.find(u => u.email === email);

  if (!user) {
    console.error('Could not find user after creation.');
    return;
  }

  console.log(`User ID: ${user.id}`);
  console.log('Upserting profile...');

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: email,
      full_name: 'System Admin',
      role: 'admin',
      status: 'active'
    });

  if (profileError) {
    console.error('Error creating profile:', profileError);
  } else {
    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

createAdmin();
