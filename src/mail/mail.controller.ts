import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '@/decorator/customizes';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SubcriberDocument } from '@/subscribers/schemas/subscriber.schema';
import { JobDocument } from '@/jobs/schemas/job.schema';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel('Subscriber') private subcriberModel: SoftDeleteModel<SubcriberDocument>,
    @InjectModel('Job') private jobModel: SoftDeleteModel<JobDocument>,
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    try {
      console.log("Fetching subscribers...");
      const subscribers = await this.subcriberModel.find({});
      console.log(`Found ${subscribers.length} subscribers.`);
      
      for (const subs of subscribers) {
        const subsSkills = subs.skills;
        console.log(`Fetching jobs for subscriber: ${subs.name}`);
        const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
        console.log(`Found ${jobWithMatchingSkills.length} matching jobs.`);
        
        if (jobWithMatchingSkills?.length) {
          const jobs = jobWithMatchingSkills.map(item => {
            return {
              name: item.name,
              company: item.company,
              salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " vnđ",
              skills: item.skills
            }
          });
          
          try {
            console.log(`Sending email to ${subs.email}...`);
            await this.mailerService.sendMail({
              to: subs.email,
              from: '"Support Team" <support@example.com>',
              subject: 'Welcome to Nice App! Confirm your Email',
              template: "new-job",
              context: {
                receiver: subs.name,
                jobs: jobs
              }
            });
            console.log(`Email sent to ${subs.email}.`);
          } catch (emailError) {
            console.error(`Failed to send email to ${subs.email}:`, emailError);
          }
        }
      }
    } catch (error) {
      console.error("Error handling test email:", error);
    }
  }
}
