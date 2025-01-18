import "../styles/TeamMemberCard.css";

interface StaffMember {
  staffId: number;
  name: string;
  role: string;
  headshot: string;
  description: string;
}

interface TeamMemberCardProps {
  member: StaffMember;
  index: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => (
  <div className="team-member-card" style={{ animationDelay: `${index * 0.2}s` }}>
    <img src={member.headshot} alt={`${member.name}'s headshot`} className="staff-headshot" />
    <h3>{member.name}</h3>
    <h4 className="staff-role">{member.role}</h4>
    <p className="staff-description">{member.description}</p>
  </div>
);

export default TeamMemberCard;
