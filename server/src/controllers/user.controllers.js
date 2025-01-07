import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import ApiError from '../config/ApiError.js'; 

const prisma = new PrismaClient();

const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, password, phoneNumber, role, companyName } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role || !companyName) {
      throw new ApiError(400, "All fields are required: fullname, email, password, phoneNumber, role, companyName");
    }

    const validRoles = ['seeker', 'hirer', 'admin'];
    if (!validRoles.includes(role)) {
      throw new ApiError(400, `Invalid role. Valid roles are: ${validRoles.join(', ')}`);
    }

    console.log(`Registering user: Fullname - ${fullname}, Email - ${email}, Role - ${role}, Company - ${companyName || 'N/A'}`);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingPhone) {
      throw new ApiError(409, "Phone number is already registered");
    }

    let company = null;
    if (companyName) {
      company = await prisma.company.upsert({
        where: { company_name: companyName },
        update: {}, 
        create: {
          company_name: companyName,
          email,
          phoneNumber,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        companyID: company ? company.company_id : null,
      },
    });

    res.status(201).json({
      success: true,
      status: "success",
      message: "User registered successfully",
      data: {
        user_id: newUser.user_id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        company: companyName,
      },
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Internal server error", [], error.stack)
    );
  } finally {
    await prisma.$disconnect();
  }
};

export { registerUser };
